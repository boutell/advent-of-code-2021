import { readFileSync as read } from 'fs';

const input:Array<string> = read('day-3.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

const counts = new Array<Array<number>>();

for (const value of input) {
  for (let i = 0; (i < value.length); i++) {
    counts[i] = counts[i] || new Array<number>();
    const bit = +value[i];
    counts[i][bit] = counts[i][bit] || 0;
    counts[i][bit]++;
  }
}

let gamma = 0;
let epsilon = 0;

let bit = 1;
for (let i = input[0].length - 1; (i >= 0); i--) {
  if (counts[i][1] > counts[i][0]) {
    gamma += bit;
  } else {
    epsilon += bit;
  }
  bit <<= 1;
}

console.log(gamma * epsilon);
