import { readFileSync as read } from 'fs';

interface Line {
  x1:number,
  y1:number,
  x2:number,
  y2:number
};

const input:Array<Line> = read('day-5.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => {
    const split = line.split(/[ ,\->]+/);
    if (split.length !== 4) {
      throw new Error(`Strange format: ${line} parses as ${JSON.stringify(split)}`);
    }
    return {
      x1: parseInt(split[0], 10),
      y1: parseInt(split[1], 10),
      x2: parseInt(split[2], 10),
      y2: parseInt(split[3], 10)
    };
  });

const minx = Math.min(...input.map(line => line.x1), ...input.map(line => line.x2));
const maxx = Math.max(...input.map(line => line.x1), ...input.map(line => line.x2));
const miny = Math.min(...input.map(line => line.y1), ...input.map(line => line.y2));
const maxy = Math.max(...input.map(line => line.y1), ...input.map(line => line.y2));

interface Cell {
  value:number,
  pens:Array<boolean>
};

type Grid = Array<Array<Cell>>;

const grid:Grid = new Array(maxy - miny + 1);
for (let i = 0; (i < maxy - miny + 1); i++) {
  grid[i] = new Array(maxx - minx + 1);
}
for (let y = miny; (y <= maxy); y++) {
  for (let x = minx; (x <= maxx); x++) {
    grid[scaley(y)][scalex(x)] = {
      pens: [],
      value: 0
    };
  }
}

let pen = 0;
for (const line of input) {
  let distance = Math.sqrt(Math.pow((line.x2 - line.x1), 2) + Math.pow((line.y2 - line.y1), 2));
  for (let i = 0; (i <= distance); i += 0.5) {
    const x = line.x1 + (line.x2 - line.x1) * i / distance;
    const y = line.y1 + (line.y2 - line.y1) * i / distance;
    set(x, y, get(x, y) + 1, pen);
  }
  pen++;
}

print();

console.log(grid.flat().filter(cell => cell.value >= 2).length);

function print() {
  console.log(grid.map(line => line.map(line => line.value).join(' ')));
}

function set(x:number, y:number, value:number, pen:number) {
  const cell = grid[scaley(y)][scalex(x)];
  if (cell.pens[pen]) {
    return;
  }
  cell.pens[pen] = true;
  cell.value = value;
}

function get(x:number, y:number):number {
  return grid[scaley(y)][scalex(x)].value || 0;
}

function scaley(y:number):number {
  return Math.round(y) - miny;
}

function scalex(x:number):number {
  return Math.round(x) - minx;
}
