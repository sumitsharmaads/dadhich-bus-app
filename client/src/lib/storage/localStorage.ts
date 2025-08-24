import { TokenType, UserInfoType, WebsiteInfoType } from "@/types";
import { decryptData, encryptData } from "@/utils/encryption";

// Check if we're in the browser environment
const isClient = typeof window !== "undefined";

const storage = isClient ? window.localStorage : null;

const createStorage = function createStorage<T>(subPrefix: string = "") {
  const prefix = `${subPrefix}`;

  return {
    getItem(itemName: string): T | null {
      if (!storage) return null; // SSR safety

      const items = storage.getItem(`${prefix}_${itemName}`);
      if (items) {
        try {
          const decryptedData = decryptData(items);
          return JSON.parse(decryptedData) as T;
        } catch (e) {
          return null;
        }
      }
      return null;
    },

    setItem(itemName: string, value: T): void {
      if (!storage) return; // SSR safety

      try {
        const stringValue = JSON.stringify(value);
        const encryptedData = encryptData(stringValue);
        storage.setItem(`${prefix}_${itemName}`, encryptedData);
      } catch (e) {
        console.error("Error storing data:", e);
      }
    },

    removeItem(itemName: string): void {
      if (!storage) return; // SSR safety
      storage.removeItem(`${prefix}_${itemName}`);
    },

    clear(): void {
      if (!storage) return; // SSR safety

      // Clear only items with our prefix
      const keys = Object.keys(storage);
      keys.forEach((key) => {
        if (key.startsWith(`${prefix}_`)) {
          storage.removeItem(key);
        }
      });
    },
  };
};

// Default storage
const DefaultStore = createStorage<unknown>("default");

// Typed storage instances
export const tokenStorage = createStorage<TokenType>("token");
export const userStorage = createStorage<UserInfoType>("users");
export const websiteStorage = createStorage<WebsiteInfoType | null>("website");
export const websiteStorageExpiry = createStorage<Date | string | null>(
  "webExpiry"
);
export const tokenExpiryStorage = createStorage<string | null>("expiry");

// Session storage for temporary data
const createSessionStorage = function createSessionStorage<T>(
  subPrefix: string = ""
) {
  const sessionStorage = isClient ? window.sessionStorage : null;
  const prefix = `session_${subPrefix}`;

  return {
    getItem(itemName: string): T | null {
      if (!sessionStorage) return null;

      const items = sessionStorage.getItem(`${prefix}_${itemName}`);
      if (items) {
        try {
          return JSON.parse(items) as T;
        } catch (e) {
          return null;
        }
      }
      return null;
    },

    setItem(itemName: string, value: T): void {
      if (!sessionStorage) return;

      try {
        const stringValue = JSON.stringify(value);
        sessionStorage.setItem(`${prefix}_${itemName}`, stringValue);
      } catch (e) {
        console.error("Error storing session data:", e);
      }
    },

    removeItem(itemName: string): void {
      if (!sessionStorage) return;
      sessionStorage.removeItem(`${prefix}_${itemName}`);
    },

    clear(): void {
      if (!sessionStorage) return;

      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith(`${prefix}_`)) {
          sessionStorage.removeItem(key);
        }
      });
    },
  };
};

// Session storage instances
export const tempStorage = createSessionStorage<unknown>("temp");
export const cartStorage = createSessionStorage<any>("cart");
export const formDataStorage = createSessionStorage<any>("form");

export { createStorage, createSessionStorage };
export default DefaultStore;
