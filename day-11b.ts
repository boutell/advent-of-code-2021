import { readFileSync as read } from 'fs';

interface Cell {
  energy:number,
  flashed: boolean
};

const map:Array<Array<Cell>> = read('day-11.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split('').map(v => ({
    energy: parseInt(v, 0),
    flashed: false
  })));

printMap();

let step = 0;
let flashes = 0;

do {
  flashes = 0;
  updateCells((cell, adjacent) => cell.energy++);
  let flashed = false;
  do {
    flashed = false;
    updateCells((cell, adjacent) => {
      if (cell.flashed) {
        return;
      }
      if (cell.energy > 9) {
        cell.flashed = true;
        flashes++;
        flashed = true;
        adjacent.forEach(cell => {
          cell.energy++;
        });
      }
    });
  } while (flashed);
  updateCells((cell, adjacent) => {
    if (cell.flashed) {
      cell.flashed = false;
      cell.energy = 0;
    }   
  });
  printMap();
  step++;
} while (flashes !== map.length * map[0].length);

console.log(step);

function updateCells(fn:(cell:Cell, adjacent:Array<Cell>) => void) {
  for (let y = 0; (y < map.length); y++) {
    for (let x = 0; (x < map[y].length); x++) {
      const adjacent = [];
      for (let y1 = Math.max(y-1, 0); (y1 < Math.min(y + 2, map.length)); y1++) {
        for (let x1 = Math.max(x-1, 0); (x1 < Math.min(x + 2, map[0].length)); x1++) {
          if ((x1 === x) && (y1 === y)) {
            continue;
          }
          adjacent.push(map[y1][x1]);
        }
      }
      fn(map[y][x], adjacent); 
    }
  }
}

function printMap() {
  console.log(map.map(row => row.map(cell => cell.energy).join(',')).join('\n'));
  console.log();
}
 
