import { useEffect, useState } from 'react';
import { socket } from '../socket';

const UserCursors = ({ roomId }) => {
  const [cursors, setCursors] = useState({});

  useEffect(() => {
    const handleCursorUpdate = ({ socketId, x, y }) => {
      setCursors(prev => ({
        ...prev,
        [socketId]: { x, y }
      }));
    };

    const handleUserLeft = (socketId) => {
      setCursors(prev => {
        const newCursors = { ...prev };
        delete newCursors[socketId];
        return newCursors;
      });
    };

    socket.on('cursor-update', handleCursorUpdate);
    socket.on('user-left', handleUserLeft);

    return () => {
      socket.off('cursor-update');
      socket.off('user-left');
    };
  }, []);

  return (
    <div>
      {Object.entries(cursors).map(([id, { x, y }]) => (
        <div
          key={id}
          style={{
            position: 'absolute',
            top: y,
            left: x,
            width: '10px',
            height: '10px',
            backgroundColor: 'red',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      ))}
    </div>
  );
};

export default UserCursors;
