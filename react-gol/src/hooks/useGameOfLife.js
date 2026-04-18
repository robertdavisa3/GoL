import { useState, useCallback, useEffect } from 'react';

export const ROWS = 60;
export const COLS = 80;

function createEmpty() {
  return new Array(ROWS * COLS).fill(0);
}

function createRandom() {
  return Array.from({ length: ROWS * COLS }, () => (Math.random() > 0.7 ? 1 : 0));
}

function nextGen(grid) {
  const next = new Array(ROWS * COLS).fill(0);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            n += grid[nr * COLS + nc];
          }
        }
      }
      const alive = grid[r * COLS + c];
      next[r * COLS + c] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
    }
  }
  return next;
}

export function useGameOfLife() {
  const [grid, setGrid] = useState(createEmpty);
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(10);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setGrid(g => nextGen(g));
      setGeneration(n => n + 1);
    }, 1000 / speed);
    return () => clearInterval(id);
  }, [running, speed]);

  const step = useCallback(() => {
    setGrid(g => nextGen(g));
    setGeneration(n => n + 1);
  }, []);

  const paintCell = useCallback((row, col, value) => {
    setGrid(g => {
      const idx = row * COLS + col;
      if (g[idx] === value) return g;
      const next = [...g];
      next[idx] = value;
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setGrid(createEmpty());
    setGeneration(0);
    setRunning(false);
  }, []);

  const randomize = useCallback(() => {
    setGrid(createRandom());
    setGeneration(0);
  }, []);

  const loadPattern = useCallback((pattern) => {
    const g = createEmpty();
    const cr = Math.floor(ROWS / 2);
    const cc = Math.floor(COLS / 2);
    for (const [dr, dc] of pattern) {
      const r = cr + dr;
      const c = cc + dc;
      if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
        g[r * COLS + c] = 1;
      }
    }
    setGrid(g);
    setGeneration(0);
  }, []);

  const liveCells = grid.reduce((s, v) => s + v, 0);

  return {
    grid,
    running,
    setRunning,
    generation,
    speed,
    setSpeed,
    liveCells,
    step,
    paintCell,
    clear,
    randomize,
    loadPattern,
  };
}
