export const getTourDayNight = (
  startDate: string | Date,
  endDate: string | Date
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { days: 0, nights: 0, label: "Invalid date range" };
  }

  const startDay = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate()
  );
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const msInDay = 1000 * 60 * 60 * 24;
  const diffDays =
    Math.floor((endDay.getTime() - startDay.getTime()) / msInDay) + 1;
  const nights = diffDays - 1 >= 0 ? diffDays - 1 : 0;

  return {
    days: diffDays,
    nights,
    label: `${diffDays} Day${diffDays > 1 ? "s" : ""} / ${nights} Night${
      nights > 1 ? "s" : ""
    }`,
  };
};

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The string to validate
 * @returns boolean indicating if the string is a valid ObjectId
 */
export function isValidObjectId(id: string): boolean {
  if (!id || typeof id !== "string") return false;

  // MongoDB ObjectId is a 24-character hex string
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

/**
 * Formats a number as Indian currency
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export function formatIndianCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Capitalizes the first letter of each word in a string
 * @param str - The string to capitalize
 * @returns Capitalized string
 */
export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Truncates text to a specified length and adds ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Debounces a function call
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
