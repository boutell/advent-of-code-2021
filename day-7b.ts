import { readFileSync as read } from 'fs';
const crabs:Array<number> = read('day-7.txt', { encoding: 'utf8' })
  .split(',')
  .map(n => parseInt(n, 10));
crabs.sort((a, b) => {
  return a - b;
});

const min = crabs[0];
const max = crabs[crabs.length - 1];

let leastCost:number|null = null;
for (let i = min; (i <= max); i++) {
  const cost = crabs.reduce((a, crab) => sumSeries(Math.abs(crab - i)) + a, 0);
  if (leastCost !== null) {
    leastCost = Math.min(leastCost, cost);
  } else {
    leastCost = cost;
  }
}

console.log(leastCost);

function sumSeries(n:number):number {
  let sum = 0;
  for (let i = 1; (i <= n); i++) {
    sum += i;
  }
  return sum;
}