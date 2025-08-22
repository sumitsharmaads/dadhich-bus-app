import { Request, Response } from 'express';
import { websiteRepository } from '../repositories/website.repository';
import { asyncHandler } from '../utils/asyncHandler';
import { sendCreated, sendNoContent, sendSuccess } from '../utils/apiResponse';
import { WebsiteDocument } from '../models/website.model';

/**
 * Transform and validate website data before saving
 * This ensures backward compatibility and data consistency
 */
const transformWebsiteData = (data: any, _req?: Request): Partial<WebsiteDocument> => {
  const transformed: any = { ...data };

  // Handle legacy field mappings for backward compatibility
  if (data.phone) {
    transformed.contact = { ...transformed.contact, phone: data.phone };
  }

  if (data.logo) {
    transformed.branding = { ...transformed.branding, logo: data.logo };
  }

  if (data.preLogo) {
    transformed.branding = { ...transformed.branding, preLogo: data.preLogo };
  }

  if (data.brandname) {
    transformed.branding = { ...transformed.branding, brandName: data.brandname };
  }

  if (data.contactAddress) {
    transformed.contact = { ...transformed.contact, address: data.contactAddress };
  }

  if (data.socialLinks) {
    transformed.socials = data.socialLinks;
  }

  if (data.emails) {
    transformed.contact = { ...transformed.contact, emails: data.emails };
  }

  // Ensure required fields are present
  if (!transformed.branding?.brandName) {
    transformed.branding = {
      ...transformed.branding,
      brandName: 'Dadhich Bus Service', // Default brand name
    };
  }

  // if (!transformed.domains?.primary) {
  //   // Automatically detect primary domain from request
  //   const host =
  //     req?.get('host') || req?.get('x-forwarded-host') || req?.get('x-host') || 'localhost:3000';
  //   transformed.domains = {
  //     primary: host,
  //     aliases: transformed.domains?.aliases || [],
  //   };
  // }

  return transformed;
};

/**
 * Transform website data for response (client-friendly format)
 */
const transformResponseData = (website: WebsiteDocument | null): any => {
  if (!website) return null;

  return {
    id: website._id,
    branding: website.branding,
    contact: website.contact,
    socials: website.socials,
    seo: website.seo,
    booking: website.booking,
    rental: website.rental,
    business: website.business,
    files: website.files,
    domains: website.domains,
    analytics: website.analytics,
    flags: website.flags,

    // Legacy fields for backward compatibility
    phone: website.phone || website.contact?.phone,
    logo: website.logo || website.branding?.logo,
    preLogo: website.preLogo || website.branding?.preLogo,
    brandname: website.brandname || website.branding?.brandName,
    contactAddress: website.contactAddress || website.contact?.address,
    socialLinks: website.socialLinks || website.socials,
    emails: website.emails || website.contact?.emails,

    createdAt: website.createdAt,
    updatedAt: website.updatedAt,
  };
};

export const listWebsites = asyncHandler(async (_req: Request, res: Response) => {
  const items = await websiteRepository.list();
  const transformedItems = items.map(transformResponseData);
  sendSuccess(res, transformedItems, 'Websites fetched successfully');
});

export const getWebsiteById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Website ID is required',
      code: 'MISSING_ID',
    });
  }

  const item = await websiteRepository.getById(id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Website not found',
      code: 'NOT_FOUND',
    });
  }

  const transformedItem = transformResponseData(item);
  sendSuccess(res, transformedItem, 'Website fetched successfully');
});

export const getWebsiteByHost = asyncHandler(async (req: Request, res: Response) => {
  // Automatically detect host from request headers

  const { host } = req.query;
  if (!host || typeof host !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Could not determine host from request',
      code: 'HOST_NOT_DETECTED',
    });
  }

  const item = await websiteRepository.getByHost(host);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Website not found for this host',
      code: 'NOT_FOUND',
    });
  }

  const transformedItem = transformResponseData(item);
  sendSuccess(res, transformedItem, 'Website by host fetched successfully');
});

export const createWebsite = asyncHandler(async (req: Request, res: Response) => {
  try {
    // Transform and validate the incoming data
    const transformedData = transformWebsiteData(req.body, req);

    // Check if website already exists
    const existingWebsites = await websiteRepository.list();
    if (existingWebsites.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Website already exists. Use update instead.',
        code: 'ALREADY_EXISTS',
      });
    }

    const created = await websiteRepository.create(transformedData);
    const transformedResponse = transformResponseData(created);

    sendCreated(res, transformedResponse, 'Website created successfully');
  } catch (error: any) {
    console.error('Error creating website:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message,
        code: 'VALIDATION_ERROR',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create website',
      code: 'CREATE_ERROR',
    });
  }
});

export const updateWebsite = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Website ID is required',
      code: 'MISSING_ID',
    });
  }

  try {
    // Check if website exists
    const existingWebsite = await websiteRepository.getById(id);
    if (!existingWebsite) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
        code: 'NOT_FOUND',
      });
    }

    // Transform and validate the incoming data
    const transformedData = transformWebsiteData(req.body, req);

    // Merge with existing data to preserve unchanged fields
    const mergedData = {
      ...existingWebsite.toObject(),
      ...transformedData,
      // Ensure nested objects are properly merged
      branding: {
        ...existingWebsite.branding,
        ...transformedData.branding,
      },
      contact: {
        ...existingWebsite.contact,
        ...transformedData.contact,
        address: {
          ...existingWebsite.contact?.address,
          ...transformedData.contact?.address,
        },
        emails: {
          ...existingWebsite.contact?.emails,
          ...transformedData.contact?.emails,
        },
      },
      socials: {
        ...existingWebsite.socials,
        ...transformedData.socials,
      },
      seo: {
        ...existingWebsite.seo,
        ...transformedData.seo,
      },
      booking: {
        ...existingWebsite.booking,
        ...transformedData.booking,
      },
      rental: {
        ...existingWebsite.rental,
        ...transformedData.rental,
      },
      business: {
        ...existingWebsite.business,
        ...transformedData.business,
      },
      analytics: {
        ...existingWebsite.analytics,
        ...transformedData.analytics,
      },
      flags: {
        ...existingWebsite.flags,
        ...transformedData.flags,
      },
    };

    const updated = await websiteRepository.update(id, mergedData);

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update website',
        code: 'UPDATE_ERROR',
      });
    }

    const transformedResponse = transformResponseData(updated);
    sendSuccess(res, transformedResponse, 'Website updated successfully');
  } catch (error: any) {
    console.error('Error updating website:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message,
        code: 'VALIDATION_ERROR',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update website',
      code: 'UPDATE_ERROR',
    });
  }
});

export const deleteWebsite = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Website ID is required',
      code: 'MISSING_ID',
    });
  }

  try {
    // Check if website exists
    const existingWebsite = await websiteRepository.getById(id);
    if (!existingWebsite) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
        code: 'NOT_FOUND',
      });
    }

    await websiteRepository.remove(id);
    sendNoContent(res);
  } catch (error: any) {
    console.error('Error deleting website:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete website',
      code: 'DELETE_ERROR',
    });
  }
});

// Additional utility methods for settings management
export const getWebsiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Website ID is required',
      code: 'MISSING_ID',
    });
  }

  const item = await websiteRepository.getById(id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: 'Website not found',
      code: 'NOT_FOUND',
    });
  }

  const transformedItem = transformResponseData(item);
  sendSuccess(res, transformedItem, 'Website settings fetched successfully');
});

export const updateWebsiteSettings = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'Website ID is required',
      code: 'MISSING_ID',
    });
  }

  try {
    // Check if website exists
    const existingWebsite = await websiteRepository.getById(id);
    if (!existingWebsite) {
      return res.status(404).json({
        success: false,
        message: 'Website not found',
        code: 'NOT_FOUND',
      });
    }

    // Transform and validate the incoming data
    const transformedData = transformWebsiteData(req.body, req);

    const updated = await websiteRepository.update(id, transformedData);

    if (!updated) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update website settings',
        code: 'UPDATE_ERROR',
      });
    }

    const transformedResponse = transformResponseData(updated);
    sendSuccess(res, transformedResponse, 'Website settings updated successfully');
  } catch (error: any) {
    console.error('Error updating website settings:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message,
        code: 'VALIDATION_ERROR',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update website settings',
      code: 'UPDATE_ERROR',
    });
  }
});
