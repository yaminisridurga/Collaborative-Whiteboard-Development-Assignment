const mongoose = require('mongoose');

const DrawingCommandSchema = new mongoose.Schema({
  type: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: Date
});

const RoomSchema = new mongoose.Schema({
  roomId: { type: String, unique: true },
  createdAt: Date,
  lastActivity: Date,
  drawingData: [DrawingCommandSchema]
});

module.exports = mongoose.model('Room', RoomSchema);
