import express from 'express';
import { 
  getSession, 
  getSessionByMac, 
  pauseSession, 
  resumeSession, 
  updateSessionTime, 
  terminateSession 
} from '../controllers/sessionController.js';

const router = express.Router();

// Get session by ID
router.get('/:sessionId', getSession);

// Get session by MAC address
router.get('/mac/:macAddress', getSessionByMac);

// Pause session
router.post('/:sessionId/pause', pauseSession);

// Resume session
router.post('/:sessionId/resume', resumeSession);

// Update session time (called by frontend timer)
router.put('/:sessionId/time', updateSessionTime);

// Terminate session
router.post('/:sessionId/terminate', terminateSession);

export default router;
