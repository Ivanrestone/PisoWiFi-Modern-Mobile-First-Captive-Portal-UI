import { Voucher, Session } from '../models/index.js';
import { Op } from 'sequelize';

export const validateVoucher = async (req, res) => {
  try {
    const { code, macAddress, ipAddress } = req.body;

    if (!code || !macAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Voucher code and MAC address are required' 
      });
    }

    // Find voucher
    const voucher = await Voucher.findOne({ where: { code: code.toUpperCase() } });

    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid voucher code' 
      });
    }

    // Check voucher status
    if (voucher.status === 'disabled') {
      return res.status(400).json({ 
        success: false, 
        message: 'This voucher has been disabled' 
      });
    }

    if (voucher.status === 'expired') {
      return res.status(400).json({ 
        success: false, 
        message: 'This voucher has expired' 
      });
    }

    if (voucher.status === 'used') {
      return res.status(400).json({ 
        success: false, 
        message: 'This voucher has already been used' 
      });
    }

    // Check device limit
    if (voucher.devicesUsed >= voucher.deviceLimit) {
      return res.status(400).json({ 
        success: false, 
        message: 'This voucher has reached its device limit' 
      });
    }

    // Check expiration date
    if (voucher.expirationDate && new Date() > voucher.expirationDate) {
      await voucher.update({ status: 'expired' });
      return res.status(400).json({ 
        success: false, 
        message: 'This voucher has expired' 
      });
    }

    // Check if device already has an active session
    const existingSession = await Session.findOne({
      where: {
        macAddress,
        status: 'active'
      }
    });

    if (existingSession) {
      return res.status(400).json({ 
        success: false, 
        message: 'You already have an active session' 
      });
    }

    // Calculate session duration in seconds
    const durationInSeconds = voucher.duration * 60;
    const endTime = new Date(Date.now() + durationInSeconds * 1000);

    // Create session
    const session = await Session.create({
      voucherCode: voucher.code,
      macAddress,
      ipAddress: ipAddress || null,
      duration: durationInSeconds,
      remainingTime: durationInSeconds,
      endTime,
      status: 'active',
      isPaused: false
    });

    // Update voucher
    await voucher.update({ 
      devicesUsed: voucher.devicesUsed + 1,
      status: voucher.devicesUsed + 1 >= voucher.deviceLimit ? 'used' : 'active'
    });

    res.json({
      success: true,
      message: 'Voucher validated successfully',
      data: {
        session: {
          id: session.id,
          duration: session.duration,
          remainingTime: session.remainingTime,
          endTime: session.endTime,
          status: session.status
        },
        voucher: {
          code: voucher.code,
          duration: voucher.duration
        }
      }
    });
  } catch (error) {
    console.error('Voucher validation error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during voucher validation' 
    });
  }
};

export const getVoucherStatus = async (req, res) => {
  try {
    const { code } = req.params;

    const voucher = await Voucher.findOne({ 
      where: { code: code.toUpperCase() } 
    });

    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Voucher not found' 
      });
    }

    res.json({
      success: true,
      data: voucher
    });
  } catch (error) {
    console.error('Get voucher status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
