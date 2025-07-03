import { useState } from 'react';
import { useParams } from 'react-router-dom';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';

const Whiteboard = () => {
  const { roomId } = useParams();

  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(2);

  return (
    <div className="whiteboard-container">
      <Toolbar color={color} setColor={setColor} lineWidth={lineWidth} setLineWidth={setLineWidth} />
      <DrawingCanvas roomId={roomId} color={color} lineWidth={lineWidth} />
      <UserCursors roomId={roomId} />
    </div>
  );
};

export default Whiteboard;
