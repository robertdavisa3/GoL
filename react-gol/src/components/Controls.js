import React from 'react';

const PATTERNS = {
  Glider: [
    [-1, 0], [0, 1], [1, -1], [1, 0], [1, 1],
  ],
  Blinker: [
    [0, -1], [0, 0], [0, 1],
  ],
  Toad: [
    [0, 0], [0, 1], [0, 2], [1, -1], [1, 0], [1, 1],
  ],
  Beacon: [
    [-1, -1], [-1, 0], [0, -1], [0, 0], [1, 1], [1, 2], [2, 1], [2, 2],
  ],
  Pulsar: [
    [-6, -4], [-6, -3], [-6, -2], [-6, 2], [-6, 3], [-6, 4],
    [-4, -6], [-4, -1], [-4, 1], [-4, 6],
    [-3, -6], [-3, -1], [-3, 1], [-3, 6],
    [-2, -6], [-2, -1], [-2, 1], [-2, 6],
    [-1, -4], [-1, -3], [-1, -2], [-1, 2], [-1, 3], [-1, 4],
    [1, -4], [1, -3], [1, -2], [1, 2], [1, 3], [1, 4],
    [2, -6], [2, -1], [2, 1], [2, 6],
    [3, -6], [3, -1], [3, 1], [3, 6],
    [4, -6], [4, -1], [4, 1], [4, 6],
    [6, -4], [6, -3], [6, -2], [6, 2], [6, 3], [6, 4],
  ],
  'Gosper Glider Gun': [
    [-4, 6],
    [-3, 4], [-3, 6],
    [-2, -6], [-2, -5], [-2, 2], [-2, 3], [-2, 16], [-2, 17],
    [-1, -7], [-1, -3], [-1, 2], [-1, 3], [-1, 16], [-1, 17],
    [0, -18], [0, -17], [0, -8], [0, -2], [0, 2], [0, 3],
    [1, -18], [1, -17], [1, -8], [1, -4], [1, -2], [1, -1], [1, 4], [1, 6],
    [2, -8], [2, -2], [2, 6],
    [3, -7], [3, -3],
    [4, -6], [4, -5],
  ],
};

export default function Controls({
  running, setRunning, step, clear, randomize, loadPattern,
  generation, liveCells, speed, setSpeed,
}) {
  return (
    <div className="controls">
      <div className="controls-row">
        <button
          className={`btn ${running ? 'btn-pause' : 'btn-play'}`}
          onClick={() => setRunning(r => !r)}
        >
          {running ? 'Pause' : 'Play'}
        </button>
        <button className="btn" onClick={step} disabled={running}>
          Step
        </button>
        <button className="btn btn-danger" onClick={clear}>
          Clear
        </button>
        <button className="btn" onClick={randomize}>
          Random
        </button>
      </div>

      <div className="controls-row">
        <span className="label">
          Speed: <strong style={{ color: '#e6edf3' }}>{speed} fps</strong>
        </span>
        <input
          type="range"
          className="slider"
          min="1"
          max="60"
          value={speed}
          onChange={e => setSpeed(+e.target.value)}
        />
      </div>

      <div className="controls-row">
        <span className="label">Patterns:</span>
        <select
          defaultValue=""
          onChange={e => {
            if (e.target.value) {
              loadPattern(PATTERNS[e.target.value]);
              e.target.value = '';
            }
          }}
        >
          <option value="" disabled>Select a pattern</option>
          {Object.keys(PATTERNS).map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="stats">
        <span className="stat">Generation: <strong>{generation.toLocaleString()}</strong></span>
        <span className="stat">Alive: <strong>{liveCells.toLocaleString()}</strong></span>
      </div>
    </div>
  );
}
