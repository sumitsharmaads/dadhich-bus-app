import crypto from 'crypto';
import { env } from './env';

export function generateRandomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}

export function sha256(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}

function deriveKey(material?: string): Buffer {
  const base = material || env.JWT_SECRET;
  // Derive a 32-byte key using SHA-256 over the material
  return crypto.createHash('sha256').update(base).digest();
}

export function aesGcmEncrypt(
  plaintext: string,
  keyMaterial?: string,
): { ciphertext: string; iv: string; tag: string } {
  const key = deriveKey(keyMaterial);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
  };
}

export function aesGcmDecrypt(
  ciphertextB64: string,
  ivB64: string,
  tagB64: string,
  keyMaterial?: string,
): string {
  const key = deriveKey(keyMaterial);
  const iv = Buffer.from(ivB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertextB64, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}
