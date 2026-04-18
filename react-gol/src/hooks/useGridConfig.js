import { useState, useEffect } from 'react';

function computeConfig(width) {
  if (width < 480) return { rows: 28, cols: 40, cellSize: 8, gap: 1 };
  if (width < 768) return { rows: 40, cols: 56, cellSize: 9, gap: 1 };
  return { rows: 60, cols: 80, cellSize: 10, gap: 1 };
}

export function useGridConfig() {
  const [config, setConfig] = useState(() => computeConfig(window.innerWidth));

  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setConfig(computeConfig(window.innerWidth)), 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return config;
}
