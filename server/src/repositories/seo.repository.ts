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

    // Special handling for /tours route: inject dynamic itemListElement
    if (normalizedRoute === '/tours') {
      return (async () => {
        const seoDoc = await Seo.findOne({
          routePath: normalizedRoute,
          isDeleted: false,
          isPublished: true,
        }).lean();
        if (!seoDoc) return null;

        // Dynamically build itemListElement from Tour collection
        const Tour = require('../models/tour.model').Tour;
        const tours = await Tour.find({ isPublished: true, isDeleted: false })
          .sort({ updatedAt: -1 })
          .select('tourName seo.title seoRoutePath pricing.minFare duration type sources');

        const BASE = process.env.SITE_URL || 'https://dadhichbusservice.com';
        const itemListElement = tours.map((t: any, idx: number) => {
          const slug = t.seoRoutePath || `/tour/${t._id}`;
          // Collect locations and sources for SEO
          const locations = (t.sources || []).map((s: any) => s.cityName).filter(Boolean);
          const source = (t.sources || [])
            .map((s: any) => s.sourceName || s.cityName)
            .filter(Boolean);
          return {
            '@type': 'ListItem',
            position: idx + 1,
            url: `${BASE}${slug}`,
            name: (t.seo && t.seo.title) || t.tourName,
            locations,
            source,
            item: {
              '@type': 'TouristTrip',
              name: t.tourName,
              touristType: Array.isArray(t.type) ? t.type.join(', ') : t.type || 'Tour',
              offers: {
                '@type': 'Offer',
                priceCurrency: (t.pricing && t.pricing.currencyCode) || 'INR',
                price: (t.pricing && t.pricing.minFare) || undefined,
              },
              departureFrom: locations,
            },
          };
        });

        if (seoDoc.structuredData && seoDoc.structuredData['@type'] === 'ItemList') {
          seoDoc.structuredData.itemListElement = itemListElement;
          seoDoc.structuredData.numberOfItems = itemListElement.length;
        }
        return seoDoc;
      })();
    }

    // Default: return static SEO doc
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
