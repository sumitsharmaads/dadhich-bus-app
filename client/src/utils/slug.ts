/**
 * Utility functions for handling slugs in dynamic routes
 */

/**
 * Generate a slug from a string
 * @param text - The text to convert to slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate a user slug from user data
 * @param user - User object with id and name
 * @returns A URL-friendly slug for the user
 */
export function generateUserSlug(user: {
  _id: string;
  fullname: string;
}): string {
  const nameSlug = generateSlug(user.fullname);
  return `${nameSlug}-${user._id}`;
}

/**
 * Generate a tour slug from tour data
 * @param tour - Tour object with id and name
 * @returns A URL-friendly slug for the tour
 */
export function generateTourSlug(tour: {
  _id: string;
  tourname: string;
}): string {
  const nameSlug = generateSlug(tour.tourname);
  return `${nameSlug}-${tour._id}`;
}

/**
 * Extract ID from a slug
 * @param slug - The slug to extract ID from
 * @returns The ID part of the slug
 */
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split("-");
  const id = parts[parts.length - 1]; // Last part is the ID

  // Debug logging
  console.log("Slug:", slug);
  console.log("Parts:", parts);
  console.log("Extracted ID:", id);

  return id;
}

/**
 * Check if a string is a valid slug
 * @param slug - The slug to validate
 * @returns True if valid slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}
