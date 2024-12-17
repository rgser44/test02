const boardSize = 20;
const mineCount = 40; // 지뢰의 개수
let board = [];
let gameOver = false;

const gameBoard = document.getElementById('game-board');
const mineCountValue = document.getElementById('mine-count-value');
const resetButton = document.getElementById('reset-btn');

function initializeGame() {
  board = [];
  gameOver = false;
  gameBoard.innerHTML = '';
  const mines = generateMines();
  createBoard(mines);
  displayBoard();
  mineCountValue.textContent = mineCount; // 지뢰 개수 표시
}

function generateMines() {
  const mines = new Set();
  while (mines.size < mineCount) {
    const randomIndex = Math.floor(Math.random() * boardSize * boardSize);
    mines.add(randomIndex);
  }
  return mines;
}

function createBoard(mines) {
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = {
      isMine: mines.has(i),
      revealed: false,
      adjacentMines: 0
    };
    if (cell.isMine) {
      cell.adjacentMines = -1;
    } else {
      cell.adjacentMines = countAdjacentMines(i, mines);
    }
    board.push(cell);
  }
}

function countAdjacentMines(index, mines) {
  const adjacentPositions = [
    -boardSize - 1, -boardSize, -boardSize + 1,
    -1, 1,
    boardSize - 1, boardSize, boardSize + 1
  ];
  let mineCount = 0;

  adjacentPositions.forEach(offset => {
    const adjacentIndex = index + offset;
    if (adjacentIndex >= 0 && adjacentIndex < boardSize * boardSize) {
      if (mines.has(adjacentIndex)) {
        mineCount++;
      }
    }
  });
  return mineCount;
}

function revealCell(index) {
  if (gameOver || board[index].revealed) return;

  const cell = board[index];
  const cellElement = document.getElementById(`cell-${index}`);
  cell.revealed = true;

  if (cell.isMine) {
    cellElement.classList.add('mine');
    gameOver = true;
    revealAllMines();
    alert('게임 오버! 지뢰를 밟았습니다.');
    return;
  }

  cellElement.classList.add('revealed');
  cellElement.textContent = cell.adjacentMines > 0 ? cell.adjacentMines : '';
  colorCell(cellElement, cell.adjacentMines);

  if (cell.adjacentMines === 0) {
    revealAdjacentCells(index);
  }
}

function colorCell(cellElement, adjacentMines) {
  switch (adjacentMines) {
    case 1: cellElement.classList.add('one'); break;
    case 2: cellElement.classList.add('two'); break;
    case 3: cellElement.classList.add('three'); break;
    case 4: cellElement.classList.add('four'); break;
  }
}

function revealAdjacentCells(index) {
  const adjacentPositions = [
    -boardSize - 1, -boardSize, -boardSize + 1,
    -1, 1,
    boardSize - 1, boardSize, boardSize + 1
  ];

  adjacentPositions.forEach(offset => {
    const adjacentIndex = index + offset;
    if (adjacentIndex >= 0 && adjacentIndex < boardSize * boardSize) {
      const adjacentCell = board[adjacentIndex];
      if (!adjacentCell.revealed && !adjacentCell.isMine && adjacentCell.adjacentMines === 0) {
        revealCell(adjacentIndex);
      } else if (!adjacentCell.revealed && !adjacentCell.isMine) {
        revealCell(adjacentIndex);
      }
    }
  });
}

function revealAllMines() {
  board.forEach((cell, index) => {
    if (cell.isMine) {
      const cellElement = document.getElementById(`cell-${index}`);
      cellElement.classList.add('mine');
    }
  });
}

function displayBoard() {
  board.forEach((cell, index) => {
    const cellElement = document.createElement('div');
    cellElement.classList.add('cell');
    cellElement.id = `cell-${index}`;
    cellElement.addEventListener('click', () => revealCell(index));
    gameBoard.appendChild(cellElement);
  });
}

resetButton.addEventListener('click', initializeGame);

initializeGame();
