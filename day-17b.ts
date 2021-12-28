import { readFileSync as read } from 'fs';

let data = read('day-17.txt', { encoding: 'utf8' }).trim();
const matches = data.match(/target area: x=(-?\d+)\.\.(-?\d+), y=(-?\d+)\.\.(-?\d+)/);
if (!matches) {
  throw new Error('Invalid input');
}
const [ _all, tx1s, tx2s, ty1s, ty2s ] = matches;

const tx1 = parseInt(tx1s);
const tx2 = parseInt(tx2s);
const ty1 = parseInt(ty1s);
const ty2 = parseInt(ty2s);

console.log(tx1, tx2, ty1, ty2);

let max = Math.max(Math.abs(tx1), Math.abs(tx2), Math.abs(ty1), Math.abs(ty2)) * 5;

let highest = -Infinity;

let winners = 0;

for (let ivy = -max; (ivy < max); ivy++) {
  for (let ivx = -max; (ivx < max); ivx++) {
    let x = 0, y = 0;
    let vx = ivx, vy = ivy;
    let myHighest = -Infinity;
    for (let i = 0; (i < max); i++) {
      x += vx;
      y += vy;
      if (y > myHighest) {
        myHighest = y;
      }
      if (vx > 0) {
        vx--;
      } else if (vx < 0) {
        vx++;
      }
      vy--;
      if ((x >= tx1) && (x <= tx2) && (y >= ty1) && (y <= ty2)) {
        winners++;
        console.log(`${ivx},${ivy} ${myHighest} ${highest}`);
        highest = Math.max(highest, myHighest);
        break;
      }
    }
  }
}

console.log(winners);
