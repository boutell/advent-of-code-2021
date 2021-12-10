import { readFileSync as read } from 'fs';

const map:Array<Array<number>> = read('day-9.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split('').map(v => parseInt(v, 0)));

console.log(map);

let sum = 0;

for (let y = 0; (y < map.length); y++) {
  for (let x = 0; (x < map[y].length); x++) {
    const v:number = map[y][x];
    let low = true;
    if ((y > 0) && (map[y - 1][x] <= v)) {
      low = false;
    }
    if ((x > 0) && (map[y][x - 1] <= v)) {
      low = false;
    }
    if ((y < (map.length - 1)) && (map[y + 1][x] <= v)) {
      low = false;
    }
    if ((x < (map[y].length - 1)) && (map[y][x + 1] <= v)) {
      low = false;
    }
    if (low) {
      console.log(`${x},${y}`);
      sum += map[y][x] + 1;
    }
  }
}

console.log(sum);
