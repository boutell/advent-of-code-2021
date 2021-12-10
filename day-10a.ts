import { readFileSync as read } from 'fs';

const lines:Array<string> = read('day-10.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0);

const open = [ '(', '[', '{', '<' ];
const close = [ ')', ']', '}', '>' ];
const points = [ 3, 57, 1197, 25137 ];
let score = 0;

for (const line of lines) {
  const stack:Array<string> = [];
  for (const char of line) {
    if (open.includes(char)) {
      stack.push(char);
    } else {
      const previous = stack.pop();
      if (close[open.indexOf(previous)] !== char) {
        console.log(`Expected ${previous}, but found ${char} instead.`);
        score += points[close.indexOf(char)]; 
        break;
      }
    }
  }
}

console.log(score);
