import { useRef, useEffect, useState } from 'react';
import { socket } from '../socket';

const DrawingCanvas = ({ roomId }) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const [color, setColor] = useState('black');
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    socket.emit('join-room', roomId);

    socket.on('load-drawing', (commands) => {
      commands.forEach((cmd) => {
        if (cmd.type === 'stroke') {
          const { x0, y0, x1, y1, color, width } = cmd.data;
          drawLine(x0, y0, x1, y1, color, width);
        } else if (cmd.type === 'clear') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      });
    });

    socket.on('draw-move', ({ x0, y0, x1, y1, color, width }) => {
      drawLine(x0, y0, x1, y1, color, width);
    });

    socket.on('clear-canvas', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      socket.emit('leave-room', roomId);
      socket.off('draw-move');
      socket.off('clear-canvas');
      socket.off('load-drawing');
    };
  }, [roomId]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (e.touches) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const drawLine = (x0, y0, x1, y1, strokeColor, width) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  };

  const handleStart = (e) => {
    const { x, y } = getCoords(e);
    isDrawing.current = true;
    lastPoint.current = { x, y };
  };

  const handleMove = (e) => {
    if (!isDrawing.current) return;
    const { x: newX, y: newY } = getCoords(e);
    const { x: lastX, y: lastY } = lastPoint.current;

    drawLine(lastX, lastY, newX, newY, color, lineWidth);
    socket.emit('draw-move', {
      x0: lastX,
      y0: lastY,
      x1: newX,
      y1: newY,
      color,
      width: lineWidth,
    });

    lastPoint.current = { x: newX, y: newY };
  };

  const handleEnd = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear-canvas', { roomId });
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'whiteboard.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div>
      <div style={{
        position: 'fixed',
        top: 10,
        left: 10,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#f4f4f4',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="Select Color"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          title="Line Width"
        />
        <span>{lineWidth}px</span>
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={downloadCanvas}>Download</button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        style={{
          display: 'block',
          touchAction: 'none',
          background: 'white',
        }}
      />
    </div>
  );
};

export default DrawingCanvas;
