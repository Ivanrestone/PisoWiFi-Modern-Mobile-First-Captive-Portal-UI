import express from 'express';
import { validateVoucher, getVoucherStatus } from '../controllers/voucherController.js';

const router = express.Router();

// Validate voucher and create session
router.post('/validate', validateVoucher);

// Get voucher status
router.get('/:code/status', getVoucherStatus);

export default router;
