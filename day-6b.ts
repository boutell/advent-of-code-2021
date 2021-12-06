import { readFileSync as read } from 'fs';
const input:Array<number> = read('day-6.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  [0].split(',')
  .map(n => parseInt(n, 10));

// Number of fish at each timer stage n (0, 1, 2, 3 days to giving birth)
const nFish = [ 0, 0, 0, 0, 0, 0, 0, 0, 0 ];

for (const value of input) {
  nFish[value]++;
}

for (let i = 0; (i < 256); i++) {
  // TypeScript has to be told it'll never be undefined
  const parents = nFish.shift() as number;
  nFish.push(parents);
  nFish[6] += parents;
}

console.log(nFish.reduce((acc, n) => acc + n));
