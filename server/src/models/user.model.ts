import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type RoleType = 0 | 1 | 2; // 0: Admin, 1: User, 2: Captain
export type AccessType = -1 | 0 | 1 | 2; // -1 Frozen, 0 Active, 1 Awaiting email activation, 2 Requires password reset

export interface UserDocument extends Document {
  fullname: string;
  email: string;
  username: string;
  phone?: number;
  password: string;
  isVerified: boolean;
  createdByAdmin: boolean;
  gender?: string;
  isActive: boolean;
  isDeleted: boolean;
  roleType: RoleType;
  access: AccessType;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {}

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    fullname: { type: String, trim: true, required: true, maxlength: 64 },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    username: { type: String, required: true, lowercase: true, unique: true, index: true },
    phone: { type: Number, max: 9999999999 },
    password: { type: String, required: true, select: false },
    isVerified: { type: Boolean, default: false },
    createdByAdmin: { type: Boolean, default: false },
    gender: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false, index: true },
    roleType: { type: Number, enum: [0, 1, 2], default: 1 },
    access: { type: Number, enum: [-1, 0, 1, 2], default: 1 },
  },
  { timestamps: true },
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  // @ts-ignore
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);
