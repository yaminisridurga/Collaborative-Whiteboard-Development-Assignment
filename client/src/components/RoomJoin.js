import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomJoin.css';

const RoomJoin = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (roomCode.trim().length >= 6) {
      navigate(`/room/${roomCode}`);
    } else {
      alert('Room code must be at least 6 characters long');
    }
  };

  return (
    <div className="room-join-container">
      <h1 className="title">Join a Whiteboard Room</h1>
      <input
        type="text"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
        className="room-input"
      />
      <button onClick={handleJoin} className="join-button">Join Room</button>
    </div>
  );
};

export default RoomJoin;
