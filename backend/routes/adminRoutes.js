import express from 'express';
import {
  getDashboardStats,
  getAllVouchers,
  generateNewVouchers,
  updateVoucherStatus,
  deleteVoucher,
  getAllSessions,
  getActiveUsers
} from '../controllers/adminController.js';

const router = express.Router();

// Get dashboard statistics
router.get('/dashboard/stats', getDashboardStats);

// Get all vouchers
router.get('/vouchers', getAllVouchers);

// Generate new vouchers
router.post('/vouchers/generate', generateNewVouchers);

// Update voucher status
router.put('/vouchers/:code/status', updateVoucherStatus);

// Delete voucher
router.delete('/vouchers/:code', deleteVoucher);

// Get all sessions
router.get('/sessions', getAllSessions);

// Get active users
router.get('/users/active', getActiveUsers);

export default router;
