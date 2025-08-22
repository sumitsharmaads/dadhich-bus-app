import { FilterQuery, ProjectionType, UpdateQuery } from 'mongoose';
import { User, UserDocument } from '../models/user.model';

export const userRepository = {
  async create(
    user: Pick<UserDocument, 'fullname' | 'email' | 'password' | 'username' | 'phone'>,
  ): Promise<UserDocument> {
    return User.create(user as Partial<UserDocument>);
  },

  async findByEmail(email: string, withPassword = false): Promise<UserDocument | null> {
    const query = User.findOne({ email, isDeleted: false } as FilterQuery<UserDocument>);
    if (withPassword) query.select('+password');
    return query.exec();
  },

  async findById(
    id: string,
    projection?: ProjectionType<UserDocument>,
  ): Promise<UserDocument | null> {
    return User.findOne({ _id: id, isDeleted: false })
      .select(projection || {})
      .exec();
  },

  async selfUpdate(id: string, data: UpdateQuery<UserDocument>): Promise<UserDocument | null> {
    return User.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true }).exec();
  },

  async adminCreate(data: UpdateQuery<UserDocument>): Promise<UserDocument> {
    // Convert phone to number if it's a string
    if (data.phone && typeof data.phone === 'string') {
      data.phone = parseInt(data.phone, 10);
    }
    return User.create(data);
  },

  async adminUpdate(id: string, data: UpdateQuery<UserDocument>): Promise<UserDocument | null> {
    // Convert phone to number if it's a string
    if (data.phone && typeof data.phone === 'string') {
      data.phone = parseInt(data.phone, 10);
    }
    return User.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true }).exec();
  },

  async softDelete(id: string): Promise<UserDocument | null> {
    return User.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  },

  async list(condition: any) {
    const {
      search,
      roleTypes,
      access,
      isActive,
      page = 1,
      items = 50,
      sort = { createdAt: -1 },
    } = condition || {};

    const filter: FilterQuery<UserDocument> = { isDeleted: false };

    if (search) {
      const q: FilterQuery<UserDocument>[] = [];
      for (const key in search) {
        if (search[key] && search[key].trim()) {
          q.push({ [key]: { $regex: new RegExp(search[key].trim(), 'i') } } as any);
        }
      }
      if (q.length > 0) filter.$or = q;
    }

    if (roleTypes !== undefined && roleTypes !== null && roleTypes !== '') {
      filter.roleType = Array.isArray(roleTypes) ? { $in: roleTypes } : roleTypes;
    }

    if (access !== undefined && access !== null && access !== '') {
      filter.access = access;
    }

    if (isActive !== undefined && isActive !== null && isActive !== '') {
      filter.isActive = isActive;
    }

    const docs = await User.find(filter)
      .limit(items)
      .skip((page - 1) * items)
      .sort(sort)
      .exec();
    const count = await User.countDocuments(filter);
    return { count, users: docs };
  },

  async getUsersStats() {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const activeUsers = await User.countDocuments({ isDeleted: false, isActive: true });
    const adminUsers = await User.countDocuments({ isDeleted: false, roleType: 0 });
    const captainUsers = await User.countDocuments({ isDeleted: false, roleType: 2 });

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      captainUsers,
      inactiveUsers: totalUsers - activeUsers,
    };
  },
};
