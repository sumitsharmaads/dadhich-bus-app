import { FilterQuery, UpdateQuery } from 'mongoose';
import { Website, WebsiteDocument } from '../models/website.model';

export const websiteRepository = {
  async create(data: Partial<WebsiteDocument>): Promise<WebsiteDocument> {
    return Website.create(data);
  },
  async list(condition: FilterQuery<WebsiteDocument> = {}): Promise<WebsiteDocument[]> {
    return Website.find(condition).sort({ createdAt: -1 }).exec();
  },
  async getById(id: string): Promise<WebsiteDocument | null> {
    return Website.findById(id).exec();
  },
  async getByHost(host: string): Promise<WebsiteDocument | null> {
    return Website.findOne({
      $or: [{ 'domains.primary': host }, { 'domains.aliases': host }],
    }).exec();
  },
  async update(id: string, update: UpdateQuery<WebsiteDocument>): Promise<WebsiteDocument | null> {
    return Website.findByIdAndUpdate(id, update, { new: true }).exec();
  },
  async remove(id: string): Promise<{ deletedCount?: number }> {
    return Website.deleteOne({ _id: id } as FilterQuery<WebsiteDocument>).exec();
  },
};
