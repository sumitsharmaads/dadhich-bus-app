import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Extend dayjs with required plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);

/**
 * Date and Time Formatting Utilities
 *
 * Provides consistent date/time formatting across the entire website
 * - Date format: DD/MM/YYYY
 * - Time format: HH:mm AM/PM
 * - Timezone: Asia/Kolkata (IST)
 */

// Date format constants
export const DATE_FORMAT = "DD/MM/YYYY";
export const TIME_FORMAT = "hh:mm A";
export const DATETIME_FORMAT = "DD/MM/YYYY hh:mm A";
export const ISO_FORMAT = "YYYY-MM-DD";
export const TIME_ISO_FORMAT = "HH:mm";

/**
 * Format date to DD/MM/YYYY
 * @param date - Date string, Date object, or dayjs object
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatDate = (
  date: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!date) return "";
  return dayjs(date).format(DATE_FORMAT);
};

/**
 * Format time to HH:mm AM/PM
 * @param time - Time string, Date object, or dayjs object
 * @returns Formatted time string (HH:mm AM/PM)
 */
export const formatTime = (
  time: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!time) return "";
  return dayjs(time).format(TIME_FORMAT);
};

/**
 * Format datetime to DD/MM/YYYY HH:mm AM/PM
 * @param datetime - Date string, Date object, or dayjs object
 * @returns Formatted datetime string (DD/MM/YYYY HH:mm AM/PM)
 */
export const formatDateTime = (
  datetime: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!datetime) return "";
  return dayjs(datetime).format(DATETIME_FORMAT);
};

/**
 * Parse date from DD/MM/YYYY format
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns dayjs object
 */
export const parseDate = (dateString: string): dayjs.Dayjs => {
  return dayjs(dateString, DATE_FORMAT);
};

/**
 * Parse time from HH:mm AM/PM format
 * @param timeString - Time string in HH:mm AM/PM format
 * @returns dayjs object
 */
export const parseTime = (timeString: string): dayjs.Dayjs => {
  return dayjs(timeString, TIME_FORMAT);
};

/**
 * Get current date in DD/MM/YYYY format
 * @returns Current date string
 */
export const getCurrentDate = (): string => {
  return dayjs().format(DATE_FORMAT);
};

/**
 * Get current time in HH:mm AM/PM format
 * @returns Current time string
 */
export const getCurrentTime = (): string => {
  return dayjs().format(TIME_FORMAT);
};

/**
 * Get current datetime in DD/MM/YYYY HH:mm AM/PM format
 * @returns Current datetime string
 */
export const getCurrentDateTime = (): string => {
  return dayjs().format(DATETIME_FORMAT);
};

/**
 * Convert date to ISO format for API calls
 * @param date - Date string, Date object, or dayjs object
 * @returns ISO date string (YYYY-MM-DD)
 */
export const toISODate = (
  date: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!date) return "";
  return dayjs(date).format(ISO_FORMAT);
};

/**
 * Convert time to ISO format for API calls
 * @param time - Time string, Date object, or dayjs object
 * @returns ISO time string (HH:mm)
 */
export const toISOTime = (
  time: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!time) return "";
  return dayjs(time).format(TIME_ISO_FORMAT);
};

/**
 * Check if date is valid
 * @param date - Date string, Date object, or dayjs object
 * @returns boolean
 */
export const isValidDate = (
  date: string | Date | dayjs.Dayjs | null | undefined
): boolean => {
  if (!date) return false;
  return dayjs(date).isValid();
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param date - Date string, Date object, or dayjs object
 * @returns Relative time string
 */
export const getRelativeTime = (
  date: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!date) return "";
  return dayjs(date).fromNow();
};

/**
 * Add days to date
 * @param date - Date string, Date object, or dayjs object
 * @param days - Number of days to add
 * @returns New date string in DD/MM/YYYY format
 */
export const addDays = (
  date: string | Date | dayjs.Dayjs,
  days: number
): string => {
  return dayjs(date).add(days, "day").format(DATE_FORMAT);
};

/**
 * Subtract days from date
 * @param date - Date string, Date object, or dayjs object
 * @param days - Number of days to subtract
 * @returns New date string in DD/MM/YYYY format
 */
export const subtractDays = (
  date: string | Date | dayjs.Dayjs,
  days: number
): string => {
  return dayjs(date).subtract(days, "day").format(DATE_FORMAT);
};

/**
 * Get date range between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Array of date strings in DD/MM/YYYY format
 */
export const getDateRange = (
  startDate: string | Date | dayjs.Dayjs,
  endDate: string | Date | dayjs.Dayjs
): string[] => {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const dates: string[] = [];

  let current = start;
  while (current.isSameOrBefore(end)) {
    dates.push(current.format(DATE_FORMAT));
    current = current.add(1, "day");
  }

  return dates;
};

/**
 * Format date for display in tables/cards
 * @param date - Date string, Date object, or dayjs object
 * @returns Formatted date string with fallback
 */
export const formatDateForDisplay = (
  date: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!date) return "Not specified";
  return formatDate(date);
};

/**
 * Format time for display in tables/cards
 * @param time - Time string, Date object, or dayjs object
 * @returns Formatted time string with fallback
 */
export const formatTimeForDisplay = (
  time: string | Date | dayjs.Dayjs | null | undefined
): string => {
  if (!time) return "Not specified";
  return formatTime(time);
};
