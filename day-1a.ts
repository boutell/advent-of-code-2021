import { readFileSync as read } from 'fs';

const input:Array<number> = read('day-1a.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => parseInt(line));

let first:boolean = true;
let last:number = 0;
let increments:number = 0;

for (const depth of input) {
  if (first) {
    first = false;
  } else {
    if (last && depth > last) {
      increments++;
    }
  }
  last = depth;
}

console.log(increments);
