import { Session } from '../models/index.js';

export const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const getSessionByMac = async (req, res) => {
  try {
    const { macAddress } = req.params;

    const session = await Session.findOne({
      where: { macAddress },
      order: [['createdAt', 'DESC']]
    });

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'No session found for this device' 
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Get session by MAC error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const pauseSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const io = req.app.get('io');

    const session = await Session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ 
        success: false, 
        message: 'Session is not active' 
      });
    }

    await session.update({
      isPaused: true,
      status: 'paused',
      pausedAt: new Date()
    });

    // Emit socket event
    io.to(`session-${sessionId}`).emit('session-paused', {
      sessionId: session.id,
      remainingTime: session.remainingTime
    });

    res.json({
      success: true,
      message: 'Session paused successfully',
      data: session
    });
  } catch (error) {
    console.error('Pause session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const resumeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const io = req.app.get('io');

    const session = await Session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    if (session.status !== 'paused') {
      return res.status(400).json({ 
        success: false, 
        message: 'Session is not paused' 
      });
    }

    // Calculate new end time based on remaining time
    const newEndTime = new Date(Date.now() + session.remainingTime * 1000);

    await session.update({
      isPaused: false,
      status: 'active',
      resumedAt: new Date(),
      endTime: newEndTime
    });

    // Emit socket event
    io.to(`session-${sessionId}`).emit('session-resumed', {
      sessionId: session.id,
      remainingTime: session.remainingTime,
      endTime: newEndTime
    });

    res.json({
      success: true,
      message: 'Session resumed successfully',
      data: session
    });
  } catch (error) {
    console.error('Resume session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const updateSessionTime = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { remainingTime } = req.body;
    const io = req.app.get('io');

    const session = await Session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    await session.update({ remainingTime });

    // Check if session expired
    if (remainingTime <= 0) {
      await session.update({ status: 'expired' });
      io.to(`session-${sessionId}`).emit('session-expired', {
        sessionId: session.id
      });
    } else {
      // Emit real-time update
      io.to(`session-${sessionId}`).emit('time-update', {
        sessionId: session.id,
        remainingTime
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Update session time error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

export const terminateSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const io = req.app.get('io');

    const session = await Session.findByPk(sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found' 
      });
    }

    await session.update({ 
      status: 'terminated',
      remainingTime: 0
    });

    io.to(`session-${sessionId}`).emit('session-terminated', {
      sessionId: session.id
    });

    res.json({
      success: true,
      message: 'Session terminated successfully'
    });
  } catch (error) {
    console.error('Terminate session error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
