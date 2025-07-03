const Toolbar = ({ color, setColor, lineWidth, setLineWidth }) => {
  return (
    <div className="toolbar" style={styles.toolbar}>
      <label style={styles.label}>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={styles.input}
        />
      </label>
      <label style={styles.label}>
        Line Width:
        <input
          type="range"
          min="1"
          max="10"
          value={lineWidth}
          onChange={(e) => setLineWidth(parseInt(e.target.value))}
          style={styles.slider}
        />
        <span>{lineWidth}</span>
      </label>
    </div>
  );
};

const styles = {
  toolbar: {
    display: 'flex',
    gap: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#f1f1f1',
    borderBottom: '1px solid #ccc',
    alignItems: 'center',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  input: {
    cursor: 'pointer',
  },
  slider: {
    width: '100px',
  },
};

export default Toolbar;
