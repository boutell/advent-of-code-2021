import { readFileSync as read } from 'fs';

const input = read('day-8.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => {
    const parts = line.trim().split(' | ');
    return {
      signals: parts[0].split(' '),
      output: parts[1].split(' ')
    }
  });

console.log(JSON.stringify(input, null, '  '));

const digits = [ 6, 2, 5, 5, 4, 5, 6, 3, 7, 6];
const simple = {
  1: 2,
  4: 4,
  7: 3,
  8: 7
};

let sum = 0;
for (const display of input) {
  for (const value of display.output) {
    if (Object.values(simple).includes(value.length)) {
      sum++;
      console.log(value);
    }
  }
  // sum += display.output.reduce((a, v) => a + (Object.values(simple).includes(v.length) ? 1 : 0), 0);
}
console.log(sum);

