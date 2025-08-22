import { FilterQuery, PipelineStage, UpdateQuery } from 'mongoose';
import { Bus, BusDocument } from '../models/bus.model';

export const busRepository = {
  create(data: Partial<BusDocument>) {
    return Bus.create(data);
  },

  update(id: string, data: UpdateQuery<BusDocument>) {
    return Bus.findByIdAndUpdate(id, data, { new: true }).exec();
  },

  softDelete(id: string) {
    return Bus.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  },

  getById(id: string) {
    return Bus.findOne({ _id: id, isDeleted: false }).exec();
  },

  async adminList(params: any) {
    const { q, type, isActive, page = 1, items = 20 } = params || {};
    const match: FilterQuery<BusDocument> = { isDeleted: false } as any;

    if (type) (match as any).type = type;
    if (isActive !== undefined) (match as any).isActive = !!isActive;
    if (q && String(q).trim()) {
      const searchRegex = new RegExp(String(q).trim(), 'i');
      (match as any).$or = [{ name: searchRegex }, { registrationNumber: searchRegex }];
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      { $sort: { createdAt: -1 as const } },
      { $skip: (page - 1) * items },
      { $limit: items },
      {
        $project: {
          _id: 1,
          name: 1,
          registrationNumber: 1,
          capacity: 1,
          totalSeats: 1,
          type: 1,
          ac: 1,
          amenities: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    return Bus.aggregate(pipeline);
  },

  async getTotalCount(params: any) {
    const { q, type, isActive } = params || {};
    const match: FilterQuery<BusDocument> = { isDeleted: false } as any;

    if (type) (match as any).type = type;
    if (isActive !== undefined) (match as any).isActive = !!isActive;
    if (q && String(q).trim()) {
      const searchRegex = new RegExp(String(q).trim(), 'i');
      (match as any).$or = [{ name: searchRegex }, { registrationNumber: searchRegex }];
    }

    return Bus.countDocuments(match);
  },

  async getBusStats() {
    const totalBuses = await Bus.countDocuments({ isDeleted: false });
    const activeBuses = await Bus.countDocuments({ isDeleted: false, isActive: true });
    const seaterBuses = await Bus.countDocuments({ isDeleted: false, type: 'seater' });
    const sleeperBuses = await Bus.countDocuments({ isDeleted: false, type: 'sleeper' });
    const mixedBuses = await Bus.countDocuments({ isDeleted: false, type: 'mixed' });
    const acBuses = await Bus.countDocuments({ isDeleted: false, ac: true });

    return {
      totalBuses,
      activeBuses,
      inactiveBuses: totalBuses - activeBuses,
      seaterBuses,
      sleeperBuses,
      mixedBuses,
      acBuses,
      nonAcBuses: totalBuses - acBuses,
    };
  },

  async bulkUpdate(busIds: string[], updates: UpdateQuery<BusDocument>) {
    const results = await Promise.all(
      busIds.map(async (busId) => {
        try {
          return await Bus.findByIdAndUpdate(busId, updates, { new: true }).exec();
        } catch (error) {
          return { busId, error: 'Failed to update' };
        }
      }),
    );
    return results;
  },

  async bulkDelete(busIds: string[]) {
    const results = await Promise.all(
      busIds.map(async (busId) => {
        try {
          return await Bus.findByIdAndUpdate(busId, { isDeleted: true }, { new: true }).exec();
        } catch (error) {
          return { busId, error: 'Failed to delete' };
        }
      }),
    );
    return results;
  },

  async updateStatus(id: string, isActive: boolean) {
    return Bus.findByIdAndUpdate(id, { isActive }, { new: true }).exec();
  },

  async updateSeatLayout(id: string, seatLayout: any) {
    return Bus.findByIdAndUpdate(id, { seatLayout }, { new: true }).exec();
  },

  async getBusesByType(type: string) {
    return Bus.find({ type, isDeleted: false, isActive: true }).exec();
  },

  async getActiveBuses() {
    return Bus.find({ isDeleted: false, isActive: true }).exec();
  },
};
