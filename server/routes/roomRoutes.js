const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// POST /api/rooms/join
router.post('/join', async (req, res) => {
  const { roomId } = req.body;

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      room = new Room({ roomId });
      await room.save();
    }

    res.status(200).json(room);
  } catch (err) {
    res.status(500).json({ error: 'Error joining/creating room', details: err.message });
  }
});

// GET /api/rooms/:roomId
router.get('/:roomId', async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving room', details: err.message });
  }
});

module.exports = router;
