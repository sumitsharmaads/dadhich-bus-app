import CryptoJS from "crypto-js";

// Use a more secure key in production - ideally from environment variables
const SECRET_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "your-secret-key-here";

/**
 * Encrypts data using AES encryption
 * @param data - The data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    return data; // Fallback to unencrypted data
  }
};

/**
 * Decrypts data using AES decryption
 * @param encryptedData - The encrypted data to decrypt
 * @returns Decrypted string
 */
export const decryptData = (encryptedData: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    if (!decryptedText) {
      throw new Error("Failed to decrypt data");
    }

    return decryptedText;
  } catch (error) {
    return encryptedData; // Fallback to encrypted data
  }
};

/**
 * Generates a random string for tokens or IDs
 * @param length - Length of the random string
 * @returns Random string
 */
export const generateRandomString = (length: number = 32): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Hashes data using SHA256
 * @param data - Data to hash
 * @returns Hashed string
 */
export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data).toString();
};
