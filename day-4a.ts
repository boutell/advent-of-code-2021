import { readFileSync as read } from 'fs';

type Board = Array<Array<number>>;

const input:Array<string> = read('day-4.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim());

const numbers:Array<number> = splitNumbers(input);
const boards = splitBoards(input);

for (let i = 0; (i < numbers.length); i++) {
  let soFar = numbers.slice(0, i);
  const winningBoard = anyBoardWins(soFar);
  if (winningBoard) {
    console.log(boardScore(winningBoard, soFar));
    break;
  }
}

function anyBoardWins(soFar:Array<number>):Board|null {
  for (const board of boards) {
    if (boardWins(board, soFar)) {
      return board;
    }
  }
  return null;
}

function boardWins(board:Board, soFar:Array<number>):boolean {
  for (let y = 0; (y < board.length); y++) {
    let good = true;
    for (let x = 0; (x < board[y].length); x++) {
      if (!soFar.includes(board[y][x])) {
        good = false;
      }
    }
    if (good) {
      return true;
    }
  }
  for (let x = 0; (x < board[0].length); x++) {
    let good = true;
    for (let y = 0; (y < board.length); y++) {
      if (!soFar.includes(board[y][x])) {
        good = false;
      }
    }
    if (good) {
      return true;
    }
  }
  return false;
}

function boardScore(board:Board, soFar:Array<number>):number {
  let sum = 0;
  for (let y = 0; (y < board.length); y++) {
    for (let x = 0; (x < board[y].length); x++) {
      const value = board[y][x];
      if (!soFar.includes(value)) {
        sum += value;
      }
    }
  }
  return sum * soFar[soFar.length - 1];
}

function splitNumbers(input:Array<string>):Array<number> {
  return input[0].split(',').map(n => parseInt(n, 10));  
}

function splitBoards(input:Array<string>):Array<Board> {
  const boards = new Array<Board>();
  let board:Board = createBoard();
  for (let row = 1; (row < input.length); row++) {
    if (input[row] === '') {
      flushBoard();
      board = createBoard();
    } else {
      board.push(input[row].split(/\s+/).map(n => parseInt(n, 10)));
    }
  }
  flushBoard();
  function createBoard():Board {
    return [];
  }
  function flushBoard() {
    if (board.length) {
      boards.push(board);
    }  
  }
  return boards;
}

