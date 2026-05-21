import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Session = sequelize.define('Session', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  voucherCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'vouchers',
      key: 'code'
    }
  },
  macAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Device MAC address'
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Device IP address'
  },
  startTime: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'When the session should end'
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Total duration in seconds'
  },
  remainingTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Remaining time in seconds'
  },
  status: {
    type: DataTypes.ENUM('active', 'paused', 'expired', 'terminated'),
    defaultValue: 'active',
    allowNull: false
  },
  isPaused: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  pausedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resumedAt: {
    type: DataTypes.DATE,
    allowNull: true
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
  tableName: 'sessions',
  timestamps: true
});

export default Session;
