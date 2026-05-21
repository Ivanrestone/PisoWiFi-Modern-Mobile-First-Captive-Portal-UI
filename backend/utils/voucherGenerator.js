import { v4 as uuidv4 } from 'uuid';

const generateVoucherCode = (prefix = 'WIFI') => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = prefix + '-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += '-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const generateVouchers = (count, duration, prefix = 'WIFI') => {
  const vouchers = [];
  for (let i = 0; i < count; i++) {
    vouchers.push({
      code: generateVoucherCode(prefix),
      duration: duration, // in minutes
      status: 'active',
      deviceLimit: 1,
      devicesUsed: 0,
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    });
  }
  return vouchers;
};

export { generateVoucherCode, generateVouchers };
