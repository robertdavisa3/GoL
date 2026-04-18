import React, { useRef, useEffect, useCallback } from 'react';

export default function GameBoard({ grid, rows, cols, cellSize, gap, paintCell }) {
  const canvasRef = useRef(null);
  const painting = useRef(false);
  const paintVal = useRef(0);
  const stride = cellSize + gap;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0d1117';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = grid[r * cols + c] ? '#39d353' : '#161b22';
        ctx.fillRect(c * stride, r * stride, cellSize, cellSize);
      }
    }
  }, [grid, rows, cols, cellSize, stride]);

  const getCell = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const col = Math.floor(((clientX - rect.left) * scaleX) / stride);
    const row = Math.floor(((clientY - rect.top) * scaleY) / stride);
    if (row < 0 || row >= rows || col < 0 || col >= cols) return null;
    return { row, col };
  }, [rows, cols, stride]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    const cell = getCell(e.clientX, e.clientY);
    if (!cell) return;
    painting.current = true;
    paintVal.current = grid[cell.row * cols + cell.col] ? 0 : 1;
    paintCell(cell.row, cell.col, paintVal.current);
  }, [getCell, grid, cols, paintCell]);

  const handleMouseMove = useCallback((e) => {
    if (!painting.current) return;
    const cell = getCell(e.clientX, e.clientY);
    if (cell) paintCell(cell.row, cell.col, paintVal.current);
  }, [getCell, paintCell]);

  const stopPainting = useCallback(() => { painting.current = false; }, []);

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const cell = getCell(touch.clientX, touch.clientY);
    if (!cell) return;
    painting.current = true;
    paintVal.current = grid[cell.row * cols + cell.col] ? 0 : 1;
    paintCell(cell.row, cell.col, paintVal.current);
  }, [getCell, grid, cols, paintCell]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!painting.current) return;
    const touch = e.touches[0];
    const cell = getCell(touch.clientX, touch.clientY);
    if (cell) paintCell(cell.row, cell.col, paintVal.current);
  }, [getCell, paintCell]);

  return (
    <canvas
      ref={canvasRef}
      width={cols * stride}
      height={rows * stride}
      style={{ cursor: 'crosshair', display: 'block', maxWidth: '100%', touchAction: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopPainting}
      onMouseLeave={stopPainting}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopPainting}
    />
  );
}
