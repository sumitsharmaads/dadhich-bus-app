import { FilterQuery, UpdateQuery } from 'mongoose';
import { Seo, SeoDocument } from '../models/seo.model';

export const seoRepository = {
  create(data: Partial<SeoDocument>) {
    return Seo.create(data);
  },
  update(id: string, data: UpdateQuery<SeoDocument>) {
    return Seo.findByIdAndUpdate(id, data, { new: true }).exec();
  },
  remove(id: string) {
    return Seo.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  },
  getById(id: string) {
    return Seo.findById(id).exec();
  },
  getByRoute(routePath: string) {
    // Handle null, undefined, empty string cases - default to root route
    const normalizedRoute = routePath || '/';

    return Seo.findOne({
      routePath: normalizedRoute,
      isDeleted: false,
      isPublished: true,
    }).exec();
  },
  list(filter: FilterQuery<SeoDocument> = {}) {
    return Seo.find({ isDeleted: false, ...filter })
      .sort({ updatedAt: -1 })
      .exec();
  },
};
