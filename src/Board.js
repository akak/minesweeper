import React from 'react';

function Board(props) {
    function convert2viewable(index) {
      // convert viewable index to absolute index
      const viewableWidth = Math.min(details.width, 20);
      const viewableX = index % viewableWidth;
      const viewableY = (index - viewableX) / viewableWidth;
      let i = props.board.startingCell + viewableX + viewableY * props.board.details.width;
      return i;
    }

    function handleClick(event) {
      event.preventDefault();
      event.stopPropagation();
      const actionType = event.shiftKey ? 'cMenu' : 'click';
      let index = parseInt(event.target.dataset.index);
      if (!isNaN(index)) props.onChange(actionType, convert2viewable(index));
    }
  
    function cMenu(event) {
      event.preventDefault();
      event.stopPropagation();
      const index = parseInt(event.target.dataset.index);
      if (!isNaN(index)) props.onChange('cMenu', convert2viewable(index));
    }
  
    const details = props.board.details;
    const cells = props.board.viewableCells(props.board.startingCell).map((cell, index) => {
        let className = `cell neighbours${cell.value.neighbours}`;
        if (cell.isFlagged) className += ' flag';
        if (cell.isRevealed) className += ' revealed';
        if (cell.value.isMine) className += ' mine';

      return <div className={className} data-index={index} key={cell.index}></div>;
    });

    const viewableWidth = Math.min(details.width, 20);
    const viewableHeight = Math.min(details.height, 20);
    let style = {
      gridTemplateColumns: `repeat(${viewableWidth}, 30px)`,
      gridTemplateRows: `repeat(${viewableHeight}, 30px)`};
    
    let className = `board-grid status-${props.board.status}`;
    if (props.superhero) className += ' superhero';
    
    return (
      <div className={className} onClick={handleClick} onContextMenu={cMenu} style={style} >
        {cells}
      </div>
    );
  };
  
  export default Board;
  