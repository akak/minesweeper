import React, { useState } from 'react';

function GameDetails(props) {
    const board = props.board;
    const boardDetails = board.details;
    const confirmation =
      board.notRevealed === board.details.width * board.details.height ||
      board.status !== 'game';
  
    const [width, setWidth] = useState(boardDetails.width);
    const [height, setHeight] = useState(boardDetails.height);
    const [mines, setMines] = useState(boardDetails.mines);
  
    function newBoardClick(event) {
        event.preventDefault();
        
        if (confirmation || window.confirm('The game will stop. Are you sure?'))
          props.onChange(width, height, mines);
    }
  
    return (
      <div className="details">
        <form onSubmit={newBoardClick}>
          <label>
            width:
            <input
              type="number"
              value={width}
              onChange={e => {setWidth(e.target.value)}}
            />
          </label>
          <label>
            height:
            <input
              type="number"
              value={height}
              onChange={e => {setHeight(e.target.value)}}
            />
          </label>
          <label>
            mines:
            <input
              type="number"
              value={mines}
              onChange={e => {setMines(e.target.value)}}
            />
          </label>
          <input type="submit" value="New" />
        </form>
        <div>
          <div>Left flags: {board.minesLeft}</div>
          <div>status: {board.status}</div>
          <div className="cloak">
            not revealed: {board.notRevealed}
            starting: {board.startingCell}
          </div>
        </div>
      </div>
    );
  };
  
export default GameDetails;
