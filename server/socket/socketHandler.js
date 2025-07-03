const Room = require('../models/Room');

module.exports = (io, socket) => {
  let roomId = null;

  socket.on('join-room', async (_roomId) => {
    roomId = _roomId;
    socket.join(roomId);

    const room = await Room.findOne({ roomId });
    if (room) {
      socket.emit('load-drawing', room.drawingData);
    } else {
      await Room.create({ roomId, createdAt: new Date(), lastActivity: new Date(), drawingData: [] });
    }

    io.to(roomId).emit('user-joined', { userId: socket.id });
  });

  socket.on('draw-move', async (data) => {
    if (!roomId) return;

    const command = {
      type: 'stroke',
      data: data,
      timestamp: new Date()
    };

    await Room.updateOne(
      { roomId },
      { $push: { drawingData: command }, $set: { lastActivity: new Date() } }
    );

    socket.to(roomId).emit('draw-move', data);
  });

  socket.on('clear-canvas', async () => {
    if (!roomId) return;

    await Room.updateOne(
      { roomId },
      { $push: { drawingData: { type: 'clear', data: {}, timestamp: new Date() } }, $set: { lastActivity: new Date() } }
    );

    io.to(roomId).emit('clear-canvas');
  });

  socket.on('cursor-move', (data) => {
    socket.to(roomId).emit('cursor-update', { socketId: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    socket.leave(roomId);
    io.to(roomId).emit('user-left', socket.id);
  });
};
