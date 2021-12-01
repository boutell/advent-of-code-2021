import { readFileSync as read } from 'fs';

const input:Array<number> = read('day-1.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => parseInt(line));

let first:boolean = true;
let increments:number = 0;
let last:number = 0;

for (let i:number = 0; (i < (input.length - 2)); i++) {
  const sum = input[i] + input[i + 1] + input[i + 2];
  if (first) {
    first = false;
  } else {
    if (last && sum > last) {
      increments++;
    }
  }
  last = sum;
}

console.log(increments);
