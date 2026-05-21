import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Voucher = sequelize.define('Voucher', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in minutes'
  },
  status: {
    type: DataTypes.ENUM('active', 'used', 'expired', 'disabled'),
    defaultValue: 'active',
    allowNull: false
  },
  deviceLimit: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    comment: 'Number of devices allowed per voucher'
  },
  devicesUsed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Number of devices that have used this voucher'
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the voucher expires'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'vouchers',
  timestamps: true
});

export default Voucher;
