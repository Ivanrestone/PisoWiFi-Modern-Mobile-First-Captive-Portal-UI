import { Voucher, Session, User } from '../models/index.js';
import { generateVouchers } from '../utils/voucherGenerator.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalVouchers = await Voucher.count();
    const activeVouchers = await Voucher.count({ where: { status: 'active' } });
    const usedVouchers = await Voucher.count({ where: { status: 'used' } });
    const expiredVouchers = await Voucher.count({ where: { status: 'expired' } });

    const activeSessions = await Session.count({ where: { status: 'active' } });
    const pausedSessions = await Session.count({ where: { status: 'paused' } });
    const totalSessions = await Session.count();

    // Calculate total earnings (simulation)
    const voucherPricePerMinute = 0.5; // ₱0.50 per minute
    const usedVoucherData = await Voucher.findAll({ where: { status: 'used' } });
    const totalEarnings = usedVoucherData.reduce((sum, v) => sum + (v.duration * voucherPricePerMinute), 0);

    res.json({
      success: true,
      data: {
        vouchers: {
          total: totalVouchers,
          active: activeVouchers,
          used: usedVouchers,
          expired: expiredVouchers
        },
        sessions: {
          active: activeSessions,
          paused: pausedSessions,
          total: totalSessions
        },
        earnings: {
          total: totalEarnings.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getAllVouchers = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const where = status ? { status } : {};

    const vouchers = await Voucher.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: vouchers
    });
  } catch (error) {
    console.error('Get all vouchers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const generateNewVouchers = async (req, res) => {
  try {
    const { count, duration, prefix } = req.body;

    if (!count || !duration) {
      return res.status(400).json({ 
        success: false, 
        message: 'Count and duration are required' 
      });
    }

    const newVouchers = generateVouchers(count, duration, prefix || 'WIFI');
    await Voucher.bulkCreate(newVouchers);

    res.json({
      success: true,
      message: `${count} vouchers generated successfully`,
      data: newVouchers
    });
  } catch (error) {
    console.error('Generate vouchers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const updateVoucherStatus = async (req, res) => {
  try {
    const { code } = req.params;
    const { status } = req.body;

    const voucher = await Voucher.findOne({ where: { code } });

    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Voucher not found' 
      });
    }

    await voucher.update({ status });

    res.json({
      success: true,
      message: 'Voucher status updated successfully',
      data: voucher
    });
  } catch (error) {
    console.error('Update voucher status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const deleteVoucher = async (req, res) => {
  try {
    const { code } = req.params;

    const voucher = await Voucher.findOne({ where: { code } });

    if (!voucher) {
      return res.status(404).json({ 
        success: false, 
        message: 'Voucher not found' 
      });
    }

    await voucher.destroy();

    res.json({
      success: true,
      message: 'Voucher deleted successfully'
    });
  } catch (error) {
    console.error('Delete voucher error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    const where = status ? { status } : {};

    const sessions = await Session.findAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: ['voucher']
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get all sessions error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    const activeSessions = await Session.findAll({
      where: { status: 'active' },
      include: ['voucher'],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: activeSessions
    });
  } catch (error) {
    console.error('Get active users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
