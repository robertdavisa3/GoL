import { useState, useCallback, useEffect, useRef } from 'react';

function createEmpty(rows, cols) {
  return new Array(rows * cols).fill(0);
}

function createRandom(rows, cols) {
  return Array.from({ length: rows * cols }, () => (Math.random() > 0.7 ? 1 : 0));
}

function nextGen(grid, rows, cols) {
  const next = new Array(rows * cols).fill(0);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            n += grid[nr * cols + nc];
          }
        }
      }
      const alive = grid[r * cols + c];
      next[r * cols + c] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
    }
  }
  return next;
}

export function useGameOfLife(rows, cols) {
  const [grid, setGrid] = useState(() => createEmpty(rows, cols));
  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [speed, setSpeed] = useState(10);
  const prevRows = useRef(rows);
  const prevCols = useRef(cols);

  useEffect(() => {
    if (prevRows.current !== rows || prevCols.current !== cols) {
      setGrid(createEmpty(rows, cols));
      setGeneration(0);
      setRunning(false);
      prevRows.current = rows;
      prevCols.current = cols;
    }
  }, [rows, cols]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setGrid(g => nextGen(g, rows, cols));
      setGeneration(n => n + 1);
    }, 1000 / speed);
    return () => clearInterval(id);
  }, [running, speed, rows, cols]);

  const step = useCallback(() => {
    setGrid(g => nextGen(g, rows, cols));
    setGeneration(n => n + 1);
  }, [rows, cols]);

  const paintCell = useCallback((row, col, value) => {
    setGrid(g => {
      const idx = row * cols + col;
      if (g[idx] === value) return g;
      const next = [...g];
      next[idx] = value;
      return next;
    });
  }, [cols]);

  const clear = useCallback(() => {
    setGrid(createEmpty(rows, cols));
    setGeneration(0);
    setRunning(false);
  }, [rows, cols]);

  const randomize = useCallback(() => {
    setGrid(createRandom(rows, cols));
    setGeneration(0);
  }, [rows, cols]);

  const loadPattern = useCallback((pattern) => {
    const g = createEmpty(rows, cols);
    const cr = Math.floor(rows / 2);
    const cc = Math.floor(cols / 2);
    for (const [dr, dc] of pattern) {
      const r = cr + dr;
      const c = cc + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        g[r * cols + c] = 1;
      }
    }
    setGrid(g);
    setGeneration(0);
  }, [rows, cols]);

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
