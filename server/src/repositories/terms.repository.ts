import { FilterQuery, UpdateQuery } from 'mongoose';
import { Terms, TermsDocument } from '../models/terms.model';

export const termsRepository = {
  async create(data: Partial<TermsDocument>): Promise<TermsDocument> {
    if (data.isCurrent) {
      await Terms.updateMany({ isCurrent: true }, { $set: { isCurrent: false } }).exec();
    }
    return Terms.create(data);
  },
  async update(id: string, update: UpdateQuery<TermsDocument>): Promise<TermsDocument | null> {
    if (update.isCurrent === true) {
      await Terms.updateMany({ isCurrent: true }, { $set: { isCurrent: false } }).exec();
    }
    return Terms.findByIdAndUpdate(id, update, { new: true }).exec();
  },
  async remove(id: string): Promise<{ deletedCount?: number }> {
    return Terms.deleteOne({ _id: id } as FilterQuery<TermsDocument>).exec();
  },
  async list(): Promise<TermsDocument[]> {
    return Terms.find().sort({ version: -1 }).exec();
  },
  async getById(id: string): Promise<TermsDocument | null> {
    return Terms.findById(id).exec();
  },
  async getCurrent(): Promise<TermsDocument | null> {
    return Terms.findOne({ isCurrent: true }).sort({ version: -1 }).exec();
  },
};
