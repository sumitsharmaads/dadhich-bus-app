import { FilterQuery, PipelineStage, UpdateQuery } from 'mongoose';
import { Tour, TourDocument } from '../models/tour.model';
import mongoose from 'mongoose';

export const tourRepository = {
  // Admin
  create(data: Partial<TourDocument>) {
    return Tour.create(data);
  },
  update(id: string, data: UpdateQuery<TourDocument>) {
    return Tour.findByIdAndUpdate(id, data, { new: true }).exec();
  },
  setStatus(id: string, status: 'draft' | 'published') {
    return Tour.findByIdAndUpdate(id, { status }, { new: true }).exec();
  },
  softDelete(id: string) {
    return Tour.findByIdAndUpdate(id, { isDeleted: true }, { new: true }).exec();
  },
  // Get tour by ID for admin (includes deleted tours)
  getById(id: string) {
    return Tour.findById(id)
      .populate('places.cityId', 'name state')
      .populate('sources.cityId', 'name')
      .populate('captainUserId', 'fullname username')
      .populate('busId', 'busNumber')
      .select('-__v') // Exclude version field
      .exec();
  },
  // Toggle tour active status
  async toggleActive(id: string, isActive: boolean) {
    return Tour.findByIdAndUpdate(id, { isActive }, { new: true }).exec();
  },
  async adminList(params: any) {
    const {
      page = 1,
      limit = 20,
      search,
      status,
      type,
      sourceCity,
      destinationCity,
      startDate,
      endDate,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params || {};

    // Ensure numeric values are properly converted
    const pageNum = Number(page);
    const limitNum = Number(limit);

    const match: FilterQuery<TourDocument> = { isDeleted: false } as any;

    if (status && status !== 'all') (match as any).status = status;
    if (type) (match as any).type = { $in: [type] };
    if (sourceCity) (match as any)['sources.cityName'] = new RegExp(sourceCity, 'i');
    if (destinationCity) (match as any)['places.name'] = new RegExp(destinationCity, 'i');
    if (startDate) (match as any).startDate = { $gte: new Date(startDate) };
    if (endDate) (match as any).endDate = { $lte: new Date(endDate) };
    if (minPrice !== undefined) (match as any)['pricing.minFare'] = { $gte: Number(minPrice) };
    if (maxPrice !== undefined)
      (match as any)['pricing.minFare'] = {
        ...(match as any)['pricing.minFare'],
        $lte: Number(maxPrice),
      };

    // Text search
    if (search) {
      (match as any).$or = [
        { tourName: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }

    // Get total count first
    const total = await Tour.countDocuments(match);

    // Build aggregation pipeline
    const pipeline: PipelineStage[] = [
      { $match: match },
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: (pageNum - 1) * limitNum },
      { $limit: limitNum },
      {
        $lookup: {
          from: 'cities',
          localField: 'sources.cityId',
          foreignField: '_id',
          as: 'sourceCities',
        },
      },
      {
        $lookup: {
          from: 'cities',
          localField: 'places.cityId',
          foreignField: '_id',
          as: 'destinationCities',
        },
      },
      {
        $project: {
          _id: 1,
          tourName: 1,
          status: 1,
          isActive: 1,
          startDate: 1,
          endDate: 1,
          days: 1,
          nights: 1,
          'pricing.minFare': 1,
          'pricing.currencyCode': 1,
          type: 1,
          inclusive: 1,
          capacity: 1,
          sources: 1,
          places: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    try {
      const tours = await Tour.aggregate(pipeline);

      return {
        tours,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      };
    } catch (error) {
      console.error('💥 Error in adminList aggregation:', error);
      // Return empty result if aggregation fails
      return {
        tours: [],
        total: 0,
        page: pageNum,
        limit: limitNum,
        totalPages: 0,
      };
    }
  },
  // Get admin tour statistics
  async adminStats() {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: null,
          totalTours: { $sum: 1 },
          publishedTours: { $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] } },
          draftTours: { $sum: { $cond: [{ $eq: ['$status', 'draft'] }, 1, 0] } },
          activeTours: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalCapacity: { $sum: '$capacity' },
          upcomingTours: {
            $sum: {
              $cond: [{ $gte: ['$startDate', new Date()] }, 1, 0],
            },
          },
          completedTours: {
            $sum: {
              $cond: [{ $lt: ['$endDate', new Date()] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalTours: 1,
          publishedTours: 1,
          draftTours: 1,
          activeTours: 1,
          totalCapacity: 1,
          upcomingTours: 1,
          completedTours: 1,
          totalRevenue: 0, // Placeholder - implement actual revenue calculation if needed
        },
      },
    ];

    try {
      const result = await Tour.aggregate(pipeline);
      return (
        result[0] || {
          totalTours: 0,
          publishedTours: 0,
          draftTours: 0,
          activeTours: 0,
          totalCapacity: 0,
          upcomingTours: 0,
          completedTours: 0,
          totalRevenue: 0,
        }
      );
    } catch (error) {
      console.error('Error in adminStats aggregation:', error);
      // Return default stats if aggregation fails
      return {
        totalTours: 0,
        publishedTours: 0,
        draftTours: 0,
        activeTours: 0,
        totalCapacity: 0,
        upcomingTours: 0,
        completedTours: 0,
        totalRevenue: 0,
      };
    }
  },
  // Bulk operations
  async bulkSetStatus(tourIds: string[], status: 'draft' | 'published') {
    const result = await Tour.updateMany({ _id: { $in: tourIds } }, { status });
    return {
      successCount: result.modifiedCount,
      failedCount: tourIds.length - result.modifiedCount,
      failedIds: [], // Could implement logic to identify failed IDs
    };
  },
  async bulkSoftDelete(tourIds: string[]) {
    const result = await Tour.updateMany({ _id: { $in: tourIds } }, { isDeleted: true });
    return {
      successCount: result.modifiedCount,
      failedCount: tourIds.length - result.modifiedCount,
      failedIds: [], // Could implement logic to identify failed IDs
    };
  },
  // Export tours
  async exportTours(_format: string, filters: any) {
    try {
      const XLSX = require('xlsx');

      // Build query based on filters
      const query: any = { isDeleted: false };

      if (filters?.search) {
        query.$or = [
          { tourName: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
        ];
      }

      if (filters?.status && filters.status !== 'all') {
        query.status = filters.status;
      }

      if (filters?.type) {
        query.type = filters.type;
      }

      if (filters?.sourceCity) {
        query['sources.cityName'] = { $regex: filters.sourceCity, $options: 'i' };
      }

      if (filters?.destinationCity) {
        query['places.name'] = { $regex: filters.destinationCity, $options: 'i' };
      }

      if (filters?.startDate) {
        query.startDate = { $gte: new Date(filters.startDate) };
      }

      if (filters?.endDate) {
        query.endDate = { $lte: new Date(filters.endDate) };
      }

      if (filters?.minPrice !== undefined) {
        query['pricing.minFare'] = { $gte: parseFloat(filters.minPrice) };
      }

      if (filters?.maxPrice !== undefined) {
        query['pricing.maxFare'] = { $lte: parseFloat(filters.maxPrice) };
      }

      // Get tours with populated data
      const tours = await Tour.find(query)
        .populate('sources.cityId', 'name state country')
        .populate('places.cityId', 'name state country')
        .lean()
        .exec();

      if (tours.length === 0) {
        return {
          downloadUrl: null,
          totalTours: 0,
          message: 'No tours found matching the criteria',
        };
      }

      // Transform tours data for export
      const exportData = tours.map((tour) => ({
        'Tour ID': tour._id,
        'Tour Name': tour.tourName,
        Description: tour.description || '',
        Status: tour.status,
        'Duration (Days)': tour.days || 0,
        'Duration (Nights)': tour.nights || 0,
        Capacity: tour.capacity || 0,
        'Min Age': tour.ageGroup?.[0] || 0,
        Category: tour.category || '',
        Type: tour.type || '',
        'Source City': (tour.sources?.[0]?.cityId as any)?.name || '',
        'Source State': (tour.sources?.[0]?.cityId as any)?.state?.name || '',
        'Source Country': (tour.sources?.[0]?.cityId as any)?.country?.name || '',
        Destination: tour.places?.[0]?.name || '',
        'Destination City': (tour.places?.[0]?.cityId as any)?.name || '',
        'Destination State': (tour.places?.[0]?.cityId as any)?.state?.name || '',
        'Destination Country': (tour.places?.[0]?.cityId as any)?.country?.name || '',
        'Start Date': tour.startDate ? new Date(tour.startDate).toLocaleDateString() : '',
        'End Date': tour.endDate ? new Date(tour.endDate).toLocaleDateString() : '',
        'Min Price (INR)': tour.pricing?.minFare || 0,
        'Max Price (INR)': tour.pricing?.maxFare || 0,
        Currency: tour.pricing?.currencyCode || 'INR',
        Inclusions: tour.inclusive?.join(', ') || '',
        Exclusions: tour.exclusive?.join(', ') || '',
        Highlights: tour.highlights?.join(', ') || '',
        'Terms & Conditions': tour.cancellationPolicy || '',
        'Cancellation Policy': tour.cancellationPolicy || '',
        'Is Active': tour.isActive ? 'Yes' : 'No',
        'Created At': tour.createdAt ? new Date(tour.createdAt).toLocaleDateString() : '',
        'Updated At': tour.updatedAt ? new Date(tour.updatedAt).toLocaleDateString() : '',
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 25 }, // Tour ID
        { wch: 30 }, // Tour Name
        { wch: 40 }, // Description
        { wch: 15 }, // Status
        { wch: 15 }, // Duration (Days)
        { wch: 15 }, // Duration (Nights)
        { wch: 15 }, // Capacity
        { wch: 15 }, // Min Age
        { wch: 15 }, // Category
        { wch: 15 }, // Type
        { wch: 20 }, // Source City
        { wch: 20 }, // Source State
        { wch: 20 }, // Source Country
        { wch: 25 }, // Destination
        { wch: 20 }, // Destination City
        { wch: 20 }, // Destination State
        { wch: 20 }, // Destination Country
        { wch: 15 }, // Start Date
        { wch: 15 }, // End Date
        { wch: 20 }, // Min Price
        { wch: 20 }, // Max Price
        { wch: 15 }, // Currency
        { wch: 40 }, // Inclusions
        { wch: 40 }, // Exclusions
        { wch: 40 }, // Highlights
        { wch: 50 }, // Terms & Conditions
        { wch: 50 }, // Cancellation Policy
        { wch: 15 }, // Is Active
        { wch: 15 }, // Created At
        { wch: 15 }, // Updated At
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Tours Export');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `tours_export_${timestamp}.xlsx`;

      // Create buffer
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      // For now, we'll return the buffer data
      // In a production environment, you might want to save this to a file storage service
      // and return a download URL
      return {
        downloadUrl: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${buffer.toString('base64')}`,
        totalTours: tours.length,
        filename,
        message: `Successfully exported ${tours.length} tours`,
      };
    } catch (error) {
      console.error('Tour export error:', error);
      return {
        downloadUrl: null,
        totalTours: 0,
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  },
  // Import tours
  async importTours(file: any) {
    try {
      const XLSX = require('xlsx');

      // Read the Excel file
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rawData = XLSX.utils.sheet_to_json(worksheet);

      if (!rawData || rawData.length === 0) {
        return {
          totalRows: 0,
          successCount: 0,
          failedCount: 0,
          errors: ['No data found in the uploaded file'],
        };
      }

      const results = [];
      const errors = [];
      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < rawData.length; i++) {
        const row = rawData[i];
        const rowNumber = i + 2; // +2 because Excel is 1-indexed and we have headers

        try {
          // Validate required fields
          if (
            !row['Tour Name*'] ||
            !row['Duration (Days)*'] ||
            !row['Price (INR)*'] ||
            !row['Source City*'] ||
            !row['Destination City*']
          ) {
            throw new Error(
              `Row ${rowNumber}: Missing required fields (Tour Name, Duration, Price, Source City, or Destination City)`,
            );
          }

          // Parse and validate data
          const duration = parseInt(row['Duration (Days)*']);
          if (isNaN(duration) || duration < 1) {
            throw new Error(`Row ${rowNumber}: Invalid duration. Must be a positive number.`);
          }

          const price = parseFloat(row['Price (INR)*']);
          if (isNaN(price) || price < 0) {
            throw new Error(`Row ${rowNumber}: Invalid price. Must be a positive number.`);
          }

          // Find source and destination cities
          const sourceCity = await this.findCityByName(row['Source City*']);
          if (!sourceCity) {
            throw new Error(
              `Row ${rowNumber}: Source city '${row['Source City*']}' not found in the system.`,
            );
          }

          const destinationCity = await this.findCityByName(row['Destination City*']);
          if (!destinationCity) {
            throw new Error(
              `Row ${rowNumber}: Destination city '${row['Destination City*']}' not found in the system.`,
            );
          }

          // Create tour data
          const tourData = {
            tourName: row['Tour Name*'],
            description: row['Description'] || '',
            days: duration,
            nights: duration - 1,
            pricing: {
              minFare: price,
              maxFare: price,
              currencyCode: 'INR',
            },
            capacity: parseInt(row['Max Group Size']) || 20,
            minAge: parseInt(row['Min Age']) || 0,
            category: row['Category'] || 'General',
            type: row['Type'] || 'Group',
            inclusions: row['Inclusions'] || '',
            exclusions: row['Exclusions'] || '',
            highlights: row['Highlights'] || '',
            termsAndConditions: row['Terms & Conditions'] || '',
            cancellationPolicy: row['Cancellation Policy'] || '',
            status: row['Status'] || 'draft',
            isActive: true,
            isDeleted: false,
            sources: [
              {
                cityId: sourceCity._id,
                cityName: sourceCity.name,
                stateId: sourceCity.state?._id,
                stateName: sourceCity.state?.name,
                countryId: sourceCity.country?._id,
                countryName: sourceCity.country?.name,
              },
            ],
            places: [
              {
                name: destinationCity.name,
                cityId: destinationCity._id,
                cityName: destinationCity.name,
                stateId: destinationCity.state?._id,
                stateName: destinationCity.state?.name,
                countryId: destinationCity.country?._id,
                countryName: destinationCity.country?.name,
                description: '',
                highlights: '',
                duration: 1,
              },
            ],
            startDate: new Date(),
            endDate: new Date(Date.now() + duration * 24 * 60 * 60 * 1000),
            itinerary: this.buildItinerary(row, duration),
          };

          // Create the tour
          const tour = await Tour.create(tourData);
          results.push({
            row: rowNumber,
            tourName: tour.tourName,
            status: 'success',
            tourId: tour._id,
          });
          successCount++;
        } catch (error) {
          failedCount++;
          const errorMessage =
            error instanceof Error ? error.message : `Row ${rowNumber}: Unknown error occurred`;
          errors.push(errorMessage);
          results.push({
            row: rowNumber,
            tourName: row['Tour Name*'] || 'Unknown',
            status: 'error',
            error: errorMessage,
          });
        }
      }

      return {
        totalRows: rawData.length,
        successCount,
        failedCount,
        errors,
        results,
      };
    } catch (error) {
      return {
        totalRows: 0,
        successCount: 0,
        failedCount: 1,
        errors: [
          `File processing error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ],
      };
    }
  },

  // Helper method to find city by name
  async findCityByName(cityName: string) {
    const City = mongoose.model('City');
    return City.findOne({
      name: { $regex: new RegExp(`^${cityName}$`, 'i') },
      isDeleted: false,
    })
      .populate('state country')
      .exec();
  },

  // Helper method to build itinerary from Excel data
  buildItinerary(row: any, duration: number) {
    const itinerary = [];

    for (let day = 1; day <= duration; day++) {
      const dayKey = `Itinerary Day ${day}`;
      if (row[dayKey]) {
        itinerary.push({
          day,
          title: `Day ${day}`,
          description: row[dayKey],
          activities: [],
          accommodation: '',
          meals: [],
        });
      }
    }

    return itinerary;
  },

  // Public list/search
  async searchPublic(params: any) {
    const {
      q,
      priceMin,
      priceMax,
      startDate,
      endDate,
      daysMin,
      daysMax,
      nightsMin,
      nightsMax,
      inclusive,
      type,
      sourceCity,
      placeCity,
      state,
      capacity,
      sortBy,
      page = 1,
      items = 20,
    } = params || {};

    // Create a date 1 hour from now for future tour filtering
    // const minStart = new Date();
    // minStart.setHours(minStart.getHours() + 1);

    const match: FilterQuery<TourDocument> = {
      isDeleted: false,
      status: 'published',
      isActive: true,
    } as any;

    // Handle date filtering
    if (startDate || endDate) {
      (match as any).startDate = {};
      if (startDate) {
        const userStart = new Date(startDate);
        if (!isNaN(userStart.getTime())) {
          (match as any).startDate.$gte = userStart;
        }
      }
      if (endDate) {
        const userEnd = new Date(endDate);
        if (!isNaN(userEnd.getTime())) {
          (match as any).startDate.$lte = userEnd;
        }
      }
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      (match as any)['pricing.minFare'] = {};
      if (priceMin !== undefined) (match as any)['pricing.minFare'].$gte = Number(priceMin);
      if (priceMax !== undefined) (match as any)['pricing.minFare'].$lte = Number(priceMax);
    }
    if (daysMin !== undefined || daysMax !== undefined) {
      (match as any).days = {};
      if (daysMin !== undefined) (match as any).days.$gte = Number(daysMin);
      if (daysMax !== undefined) (match as any).days.$lte = Number(daysMax);
    }
    if (nightsMin !== undefined || nightsMax !== undefined) {
      (match as any).nights = {};
      if (nightsMin !== undefined) (match as any).nights.$gte = Number(nightsMin);
      if (nightsMax !== undefined) (match as any).nights.$lte = Number(nightsMax);
    }
    if (inclusive) {
      const inclusiveValues = String(inclusive)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (inclusiveValues.length > 0) {
        (match as any).inclusive = { $in: inclusiveValues };
      }
    }
    if (type) {
      const typeValues = String(type)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (typeValues.length > 0) {
        (match as any).type = { $in: typeValues };
      }
    }
    if (sourceCity) {
      const sourceCityQuery = String(sourceCity).trim();
      if (sourceCityQuery) {
        (match as any)['sources.cityName'] = new RegExp(sourceCityQuery, 'i');
      }
    }
    if (placeCity) {
      const placeCityQuery = String(placeCity).trim();
      if (placeCityQuery) {
        (match as any)['places.name'] = new RegExp(placeCityQuery, 'i');
      }
    }
    if (state) {
      const stateQuery = String(state).trim();
      if (stateQuery) {
        (match as any).places = { $elemMatch: { state: new RegExp(stateQuery, 'i') } };
      }
    }
    if (capacity) (match as any).capacity = { $gte: Number(capacity) };

    const pipeline: PipelineStage[] = [{ $match: match }];

    if (q && String(q).trim()) {
      const searchQuery = String(q).trim();
      // Use regex search for tour name and description
      pipeline.push({
        $match: {
          $or: [
            { tourName: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      });
    }

    // Add sorting based on sortBy parameter
    let sortStage: any = { startDate: 1 }; // default sort
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          sortStage = { 'pricing.minFare': 1 };
          break;
        case 'price_desc':
          sortStage = { 'pricing.minFare': -1 };
          break;
        case 'duration_asc':
          sortStage = { days: 1 };
          break;
        case 'duration_desc':
          sortStage = { days: -1 };
          break;
        case 'date_asc':
          sortStage = { startDate: 1 };
          break;
        case 'date_desc':
          sortStage = { startDate: -1 };
          break;
        case 'popularity':
          // For popularity, we'll sort by capacity (lower capacity = more popular)
          sortStage = { capacity: 1 };
          break;
        default:
          sortStage = { startDate: 1 };
      }
    }

    // Get total count for pagination
    const countPipeline = [...pipeline];
    const totalResult = await Tour.aggregate([...countPipeline, { $count: 'total' }]);
    const total = totalResult[0]?.total || 0;

    // Add sorting
    pipeline.push({ $sort: sortStage });

    // Add pagination
    pipeline.push({ $skip: (page - 1) * items });
    pipeline.push({ $limit: items });

    // Minimal fields for list
    pipeline.push({
      $project: {
        _id: 1,
        tourName: 1,
        description: 1,
        startDate: 1,
        endDate: 1,
        days: 1,
        nights: 1,
        pricing: {
          minFare: '$pricing.minFare',
          currencyCode: '$pricing.currencyCode',
        },
        heroImage: 1,
        type: 1,
        inclusive: 1,
        capacity: 1,
        places: 1,
        sources: 1,
      },
    });

    const tours = await Tour.aggregate(pipeline);

    // Debug logging

    // Return proper structure with pagination metadata
    return {
      tours,
      total,
      page: Number(page),
      items: Number(items),
      totalPages: Math.ceil(total / Number(items)),
      hasMore: page * items < total,
    };
  },

  getPublicById(id: string) {
    // Create a date 1 hour from now for future tour filtering
    // const minStart = new Date();
    // minStart.setHours(minStart.getHours() + 1);

    return Tour.findOne({
      _id: id,
      isDeleted: false,
      isActive: true,
      // startDate: { $gte: minStart },
    })
      .select('-isDeleted')
      .populate('places.cityId', 'name')
      .populate('sources.cityId', 'name')
      .populate('captainUserId', 'fullname username')
      .exec();
  },

  async upcoming(limit = 4) {
    // Create a date 1 hour from now for future tour filtering
    // const minStart = new Date();
    // minStart.setHours(minStart.getHours() + 1);

    const result = await Tour.aggregate([
      {
        $match: {
          status: 'published',
          isActive: true,
          isDeleted: false,
          // startDate: { $gte: minStart },
        },
      },
      { $sort: { startDate: 1 as const } },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          tourName: 1,
          description: 1,
          startDate: 1,
          endDate: 1,
          days: 1,
          nights: 1,
          heroImage: 1,
          places: 1,
          sources: 1,
          pricing: {
            minFare: '$pricing.minFare',
            currencyCode: '$pricing.currencyCode',
          },
          type: 1,
          inclusive: 1,
          capacity: 1,
        },
      },
    ]);

    return result;
  },

  async priceRange() {
    // Create a date 1 hour from now for future tour filtering
    // const minStart = new Date();
    // minStart.setHours(minStart.getHours() + 1);

    const res = await Tour.aggregate([
      {
        $match: {
          status: 'published',
          isActive: true,
          isDeleted: false,
          // startDate: { $gte: minStart },
        },
      },
      {
        $group: {
          _id: null,
          min: { $min: '$pricing.minFare' },
          max: { $max: '$pricing.minFare' },
        },
      },
      { $project: { _id: 0, min: 1, max: 1 } },
    ]);

    const result = res[0] || { min: 0, max: 0 };

    return result;
  },

  async facets() {
    // Create a date 1 hour from now for future tour filtering
    // const minStart = new Date();
    // minStart.setHours(minStart.getHours() + 1);

    // Get basic facets
    const basicPipeline: PipelineStage[] = [
      {
        $match: {
          status: 'published',
          isActive: true,
          isDeleted: false,
          // startDate: { $gte: minStart },
        },
      },
    ];

    // City counts with state information
    const cityPipeline = [
      ...basicPipeline,
      { $unwind: '$places' },
      {
        $group: {
          _id: '$places.cityId',
          count: { $sum: 1 },
          name: { $last: '$places.name' },
          state: { $last: '$places.state' },
        },
      },
      { $sort: { count: -1 as const } },
      {
        $project: {
          _id: 1,
          count: 1,
          name: 1,
          state: 1,
        },
      },
    ];

    // Tour types with counts
    const typePipeline = [
      ...basicPipeline,
      { $unwind: '$type' },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 as const } },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
        },
      },
    ];

    // Inclusive features with counts
    const inclusivePipeline = [
      ...basicPipeline,
      { $unwind: '$inclusive' },
      {
        $group: {
          _id: '$inclusive',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 as const } },
      {
        $project: {
          _id: 0,
          feature: '$_id',
          count: 1,
        },
      },
    ];

    // Duration buckets with counts
    const durationPipeline = [
      ...basicPipeline,
      {
        $group: {
          _id: {
            $cond: {
              if: { $lte: ['$days', 3] },
              then: '1-3 Days',
              else: {
                $cond: {
                  if: { $lte: ['$days', 7] },
                  then: '4-7 Days',
                  else: '8+ Days',
                },
              },
            },
          },
          count: { $sum: 1 },
          minDays: { $min: '$days' },
          maxDays: { $max: '$days' },
        },
      },
      { $sort: { minDays: 1 as const } },
      {
        $project: {
          _id: 0,
          range: '$_id',
          count: 1,
          minDays: 1,
          maxDays: 1,
        },
      },
    ];

    // Price buckets with counts
    const pricePipeline = [
      ...basicPipeline,
      {
        $group: {
          _id: {
            $cond: {
              if: { $lte: ['$pricing.minFare', 5000] },
              then: '₹0 - ₹5,000',
              else: {
                $cond: {
                  if: { $lte: ['$pricing.minFare', 10000] },
                  then: '₹5,000 - ₹10,000',
                  else: {
                    $cond: {
                      if: { $lte: ['$pricing.minFare', 20000] },
                      then: '₹10,000 - ₹20,000',
                      else: '₹20,000+',
                    },
                  },
                },
              },
            },
          },
          count: { $sum: 1 },
          minPrice: { $min: '$pricing.minFare' },
          maxPrice: { $max: '$pricing.minFare' },
        },
      },
      { $sort: { minPrice: 1 as const } },
      {
        $project: {
          _id: 0,
          range: '$_id',
          count: 1,
          minPrice: 1,
          maxPrice: 1,
        },
      },
    ];

    // Source cities with counts
    const sourceCityPipeline = [
      ...basicPipeline,
      { $unwind: '$sources' },
      {
        $group: {
          _id: '$sources.cityId',
          count: { $sum: 1 },
          name: { $last: '$sources.cityName' },
        },
      },
      { $sort: { count: -1 as const } },
      {
        $project: {
          _id: 1,
          count: 1,
          name: 1,
        },
      },
    ];

    // Execute all pipelines in parallel
    const [cityCounts, types, inclusives, durationBuckets, priceBuckets, sourceCities] =
      await Promise.all([
        Tour.aggregate(cityPipeline),
        Tour.aggregate(typePipeline),
        Tour.aggregate(inclusivePipeline),
        Tour.aggregate(durationPipeline),
        Tour.aggregate(pricePipeline),
        Tour.aggregate(sourceCityPipeline),
      ]);

    const result = {
      cityCounts,
      types,
      inclusives,
      durationBuckets,
      priceBuckets,
      sourceCities,
    };

    return result;
  },

  async stateBreakup() {
    // Create a date 1 hour from now for future tour filtering
    // const minStart = new Date();
    // minStart.setHours(minStart.getHours() + 1);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          status: 'published',
          isActive: true,
          isDeleted: false,
          // startDate: { $gte: minStart },
        },
      },
      { $unwind: '$places' },
      {
        $group: {
          _id: '$places.state',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 as const } },
      {
        $project: {
          _id: 0,
          state: '$_id',
          count: 1,
        },
      },
    ];

    const stateCounts = await Tour.aggregate(pipeline);

    return stateCounts;
  },

  async tourStats() {
    const pipeline: PipelineStage[] = [
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalTours: { $sum: 1 },
          avgPrice: { $avg: '$pricing.minFare' },
          minPrice: { $min: '$pricing.minFare' },
          maxPrice: { $max: '$pricing.minFare' },
          avgDuration: { $avg: '$days' },
          minDuration: { $min: '$days' },
          maxDuration: { $max: '$days' },
          totalCapacity: { $sum: '$capacity' },
          upcomingDepartures: {
            $sum: {
              $cond: [{ $gte: ['$startDate', new Date()] }, 1, 0],
            },
          },
        },
      },
    ];

    const result = await Tour.aggregate(pipeline);
    return (
      result[0] || {
        totalTours: 0,
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgDuration: 0,
        minDuration: 0,
        maxDuration: 0,
        totalCapacity: 0,
        upcomingDepartures: 0,
      }
    );
  },

  // Get available buses for tour assignment
  async getAvailableBuses() {
    const Bus = mongoose.model('Bus');
    return Bus.find({ isActive: true, isDeleted: false })
      .select('_id registrationNumber capacity isActive type')
      .exec();
  },

  // Get available captains for tour assignment
  async getAvailableCaptains() {
    const User = mongoose.model('User');
    return User.find({
      roleType: { $in: [0, 2] },
      isActive: true,
      isDeleted: false,
    })
      .select('_id fullname username email phone isActive licenseNumber experience')
      .exec();
  },

  // Get tour categories
  async getTourCategories() {
    const categories = await Tour.distinct('category', {
      isDeleted: false,
      category: { $exists: true, $ne: null },
    });
    return categories.filter(Boolean);
  },

  // Get tour types
  async getTourTypes() {
    const types = await Tour.distinct('type', {
      isDeleted: false,
      type: { $exists: true, $ne: null },
    });
    return types.filter(Boolean);
  },
};
