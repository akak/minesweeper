const MAX_RETRY = 1000;

function North(board) {
  return -board.details.width;
}
function East(board) {
  return 1;
}
function South(board) {
  return board.details.width;
}
function West(board) {
  return -1;
}

function NW(board) {
  return North(board) + West(board);
}
function NE(board) {
  return North(board) + East(board);
}
function SE(board) {
  return South(board) + East(board);
}
function SW(board) {
  return South(board) + West(board);
}

function checkNorth(board, index) {
  return index >= South(board);
}
function checkSouth(board, index) {
  return index < board.cells.length + North(board);
}
function checkWest(board, index) {
  return index % South(board) > 0;
}
function checkEast(board, index) {
  return index % South(board) !== South(board) - 1;
}
function AllNeighbours(board, index) {
  let neighbours = [];
  if (checkNorth(board, index) && checkWest(board, index))
    neighbours.push(index + NW(board));
  if (checkNorth(board, index))
    neighbours.push(index + North(board));
  if (checkNorth(board, index) && checkEast(board, index))
    neighbours.push(index + NE(board));
  if (checkEast(board, index))
    neighbours.push(index + East(board));
  if (checkSouth(board, index) && checkEast(board, index))
    neighbours.push(index + SE(board));
  if (checkSouth(board, index))
    neighbours.push(index + South(board));
  if (checkSouth(board, index) && checkWest(board, index))
    neighbours.push(index + SW(board));
  if (checkWest(board, index))
    neighbours.push(index + West(board));
  return neighbours;
}

function chgDetails(details, board = {cells: []}) {
  // clean board
  board.details = {width: details.width, height: details.height, mines: details.mines};
  board.minesLeft = 0;
  board.status = 'game';
  board.cells.length = board.notRevealed = details.width * details.height;
  let len = board.cells.length;
  board.notRevealed = len;
  board.startingCell = 0;
  board.cells = board.cells.fill().map((c, i)=>({
    isRevealed: false, 
    isFlagged: false,
    index: i
  })).map((c)=>{
    c.value = {isMine: false, neighbours: 0};
    return c;
  });
  
  // shuffle mines and calculates the board neighbours etc.
  while (board.minesLeft < board.details.mines) {
    let newMinePlace;
    for (let retries = 0;
         retries === 0 || board.cells[newMinePlace].value.isMine;
         retries++) {
      // random place, with serial fallback. performance over randomizeness
      newMinePlace = retries < MAX_RETRY ?
          Math.floor(Math.random() * len) : retries === MAX_RETRY ?
            0 : newMinePlace + 1;
      if (newMinePlace >= len) throw new Error('Failed to shuffle mines. Too many retries!');
    }
    board.minesLeft++;
    board.cells[newMinePlace].value.isMine = true;
    AllNeighbours(board, newMinePlace).forEach(c => {
      if (board.cells[c]) board.cells[c].value.neighbours++;
      // TODO? calculate chunks
    });
  }

  board.viewableCells = function(startingCell) {
    if (board.details.width <= 20 && board.details.height <= 20) return board.cells;
    let viewable = [];
    const startingColumn = startingCell % board.details.width;
    const viewableWidth = Math.min(board.details.width, 20);
    for (let i = startingCell;
         viewable.length < 400 && i < board.cells.length;
         i++) {
      viewable.push(board.cells[i]);
      if (i % board.details.width === startingColumn + viewableWidth - 1)
        i += board.details.width - viewableWidth;
    }
    return viewable;
  };

  return board;
}

function boardReducer(state, action) {
    switch (action.type) {
      case 'chgDetails':
        state = chgDetails({width: action.width, height: action.height, mines: action.mines}, state);
        state.superhero = action.superhero;
        return {...state};
      
      case 'cMenu':
        let rClickedCell = state.cells[action.index];
        if (rClickedCell.isRevealed) break;
  
        if (rClickedCell.isFlagged) state.minesLeft++;
        else {
          if (state.minesLeft === 0) alert('you are using too many flags!');
          state.minesLeft--;
        }
        rClickedCell.isFlagged = !rClickedCell.isFlagged;
        action.type = '';
        return {...state};
  
      case 'click':
        let board = state.cells;
        let clickedCell = state.cells[action.index];
        
        if (state.status !== 'game') break;
  
        if (state.notRevealed === state.cells.length) {
          // TODO: check if we didnt started, and its a click on a mine - shuffle again...
  
        }
  
        if (clickedCell.isRevealed || clickedCell.isFlagged) break;
  
        if (clickedCell.value.isMine) {
          clickedCell.isRevealed = true;
          state.status = 'Lose';
          return {...state};
        }
  
        // paint as revealed all neighbours
        function reveal(index) {
          if (!board[index].isRevealed) {
            board[index].isRevealed = true;
            state.notRevealed--;
          }
        }
        if (clickedCell.value.neighbours !== 0)
          reveal(action.index);
        else {
          for (let queue = [action.index]; queue.length > 0; ) {
            let current = queue.pop();
            if (board[current].isRevealed) continue;
            let w_index = current;
            let e_index = current;
            for (; board[w_index].value.neighbours === 0 && checkWest(state, w_index); w_index--);
            for (; board[e_index].value.neighbours === 0 && checkEast(state, e_index); e_index++);
            for (; w_index <= e_index; w_index++) {
              
              reveal(w_index);
              if (board[w_index].value.neighbours === 0) {
                AllNeighbours(state, w_index).forEach(n => {
                  if (!board[n].isRevealed) queue.push(n);
                });
              }
            }
          }
        }
  
        if (state.notRevealed === state.details.mines) {
          state.status = 'Win';
          board.forEach(c => {
            c.isRevealed = true;
            if (c.value.isMine) c.isFlagged = true;
          });
        }
  
        return {...state};
  
      case 'chgStartingCell':
        state.startingCell = action.index;
        return {...state};
      
      case 'dblClick':
        // TODO...
        break;
      
      default:
        break;
    }
    
    return state;
  }

  export { chgDetails, boardReducer };
