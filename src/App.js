import React, { useReducer, useState } from 'react';
import Board from './Board';
import GameDetails from './GameDetails';
import LayoutMap from './LayoutMap';
import { chgDetails, boardReducer } from './boardState';
import './App.css';


function App() {
  const initialState = chgDetails({width: 15, height: 15, mines: 25});
  const [board, dispatch] = useReducer(boardReducer, initialState);
  const [superhero, setSuperhero] = useState(false);
  
  function clicks(clickType, index) {
    dispatch({type: clickType, index: index});
  }

  function handleBoardDetailsChg(width, height, mines) {
    dispatch({
      type: 'chgDetails',
      width: parseInt(width),
      height: parseInt(height),
      mines: parseInt(mines),
    });
  }

  function chgStartingCell(index) {
    dispatch({
      type: 'chgStartingCell',
      index: index
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        Minesweeper!
        <input type="checkbox" value={superhero} onChange={e => {setSuperhero(e.target.checked)}} />
      </header>
      <GameDetails board={board} onChange={handleBoardDetailsChg} />
      <Board board={board} superhero={superhero} onChange={clicks} />
      <LayoutMap board={board} onChange={chgStartingCell} />
  </div>
  );
}

export default App;
