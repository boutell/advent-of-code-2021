import { readFileSync as read } from 'fs';

const lines:Array<string> = read('day-10.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0);

const open = [ '(', '[', '{', '<' ];
const close = [ ')', ']', '}', '>' ];
const points = [ 1, 2, 3, 4 ];
let scores = [];

nextLine: for (const line of lines) {
  const stack:Array<string> = [];
  for (const char of line) {
    if (open.includes(char)) {
      stack.push(char);
    } else {
      const previous:string = stack.pop();
      if (close[open.indexOf(previous)] !== char) {
        continue nextLine;
      }
    }
  }
  const completion = stack.reverse().map(char => close[open.indexOf(char)]);
  const score = completion.reduce((a, char) => a * 5 + points[close.indexOf(char)], 0);
  scores.push(score);
}
scores.sort((a, b) => a - b);
console.log(scores);

console.log(scores[Math.floor(scores.length / 2)]);
