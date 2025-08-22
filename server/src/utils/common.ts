export function generateOTP(length = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export function getExpirationDate(duration: string | number): Date {
  const ms = typeof duration === 'number' ? duration : parseMs(duration);
  return new Date(Date.now() + ms);
}

function parseMs(value: string): number {
  // very small parser for values like 15m, 7d
  const match = value.match(/^(\d+)([smhd])$/i);
  if (!match) return Number(value) || 0;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  switch (unit) {
    case 's':
      return amount * 1000;
    case 'm':
      return amount * 60 * 1000;
    case 'h':
      return amount * 60 * 60 * 1000;
    case 'd':
      return amount * 24 * 60 * 60 * 1000;
    default:
      return amount;
  }
}
