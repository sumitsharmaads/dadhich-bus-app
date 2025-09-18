import { z } from 'zod';

// Password complexity requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minSpecialChars: 1,
  forbiddenPatterns: [
    /(.)\1{2,}/, // No 3+ consecutive identical characters
    /123|234|345|456|567|678|789|890/, // No sequential numbers
    /abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i, // No sequential letters
    /qwerty|asdfgh|zxcvbn/i, // No keyboard patterns
  ],
  commonPasswords: [
    'password',
    '123456',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
    'dragon',
    'master',
    'hello',
    'freedom',
    'whatever',
    'qazwsx',
    'trustno1',
  ],
};

// Password strength scoring
export interface PasswordStrength {
  score: number; // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    specialChars: boolean;
    noSequential: boolean;
    noRepeated: boolean;
    notCommon: boolean;
  };
}

export function validatePasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  const requirements = {
    length: password.length >= PASSWORD_REQUIREMENTS.minLength,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    specialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    noSequential: !PASSWORD_REQUIREMENTS.forbiddenPatterns.some((pattern) =>
      pattern.test(password),
    ),
    noRepeated: !/(.)\1{2,}/.test(password),
    notCommon: !PASSWORD_REQUIREMENTS.commonPasswords.includes(password.toLowerCase()),
  };

  // Calculate score
  let score = 0;
  const requirementCount = Object.keys(requirements).length;
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  score = Math.round((metRequirements / requirementCount) * 100);

  // Add feedback
  if (!requirements.length) {
    feedback.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }
  if (!requirements.uppercase) {
    feedback.push('Password must contain at least one uppercase letter');
  }
  if (!requirements.lowercase) {
    feedback.push('Password must contain at least one lowercase letter');
  }
  if (!requirements.numbers) {
    feedback.push('Password must contain at least one number');
  }
  if (!requirements.specialChars) {
    feedback.push('Password must contain at least one special character');
  }
  if (!requirements.noSequential) {
    feedback.push('Password cannot contain sequential characters');
  }
  if (!requirements.noRepeated) {
    feedback.push('Password cannot contain 3+ consecutive identical characters');
  }
  if (!requirements.notCommon) {
    feedback.push('Password cannot be a common password');
  }

  // Determine strength level
  let level: PasswordStrength['level'] = 'weak';
  if (score >= 90) level = 'very-strong';
  else if (score >= 75) level = 'strong';
  else if (score >= 60) level = 'good';
  else if (score >= 40) level = 'fair';

  return {
    score,
    level,
    feedback,
    requirements,
  };
}

// Zod password validation with custom error messages
export const passwordSchema = z
  .string()
  .min(
    PASSWORD_REQUIREMENTS.minLength,
    `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`,
  )
  .max(
    PASSWORD_REQUIREMENTS.maxLength,
    `Password must be no more than ${PASSWORD_REQUIREMENTS.maxLength} characters long`,
  )
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
    'Password must contain at least one special character',
  )
  .refine(
    (password) => !/(.)\1{2,}/.test(password),
    'Password cannot contain 3+ consecutive identical characters',
  )
  .refine(
    (password) =>
      !PASSWORD_REQUIREMENTS.forbiddenPatterns.some((pattern) => pattern.test(password)),
    'Password cannot contain sequential characters',
  )
  .refine(
    (password) => !PASSWORD_REQUIREMENTS.commonPasswords.includes(password.toLowerCase()),
    'Password cannot be a common password',
  );

// Password history validation (to be used with user model)
export function validatePasswordHistory(newPassword: string, passwordHistory: string[]): boolean {
  // Check if new password is different from last 5 passwords
  const recentPasswords = passwordHistory.slice(-5);
  return !recentPasswords.some((oldPassword) => oldPassword === newPassword);
}

// Password entropy calculation
export function calculatePasswordEntropy(password: string): number {
  const charsetSize = getCharsetSize(password);
  const length = password.length;
  return Math.log2(Math.pow(charsetSize, length));
}

function getCharsetSize(password: string): number {
  let charset = 0;
  if (/[a-z]/.test(password)) charset += 26;
  if (/[A-Z]/.test(password)) charset += 26;
  if (/\d/.test(password)) charset += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) charset += 32;
  return charset;
}
