import React from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';
import { useGameOfLife } from './hooks/useGameOfLife';

export default function App() {
  const game = useGameOfLife();

  return (
    <div className="app">
      <header className="header">
        <h1>Conway's Game of Life</h1>
        <p>Click or drag on the grid to draw cells, then press Play.</p>
      </header>
      <main className="main">
        <Controls
          running={game.running}
          setRunning={game.setRunning}
          step={game.step}
          clear={game.clear}
          randomize={game.randomize}
          loadPattern={game.loadPattern}
          generation={game.generation}
          liveCells={game.liveCells}
          speed={game.speed}
          setSpeed={game.setSpeed}
        />
        <div className="board-container">
          <GameBoard
            grid={game.grid}
            paintCell={game.paintCell}
          />
        </div>
      </main>
    </div>
  );
}
