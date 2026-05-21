import Voucher from './Voucher.js';
import Session from './Session.js';
import User from './User.js';

// Define relationships
Session.belongsTo(Voucher, { foreignKey: 'voucherCode', as: 'voucher' });
Voucher.hasMany(Session, { foreignKey: 'voucherCode', as: 'sessions' });

export { Voucher, Session, User };
