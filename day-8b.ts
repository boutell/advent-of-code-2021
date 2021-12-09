import { readFileSync as read } from 'fs';

const input = read('day-8.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => {
    const parts = line.trim().split(' | ');
    return {
      signals: parts[0].split(' ').map(sortCharacters),
      output: parts[1].split(' ').map(sortCharacters)
    }
  });

console.log(JSON.stringify(input, null, '  '));

const wiring = new Map();

// console.log(count);

const digitsByCount = [];



for (let i = 1; (i <= 7); i++) {
  digitsByCount[i] = [];
}

for (let i = 0; (i <= 9); i++) {
  digitsByCount[digits[i].length].push(i);
}

// for (const display of input) {
//   for (const value of [...display.signals, ...display.output]) {
//     if (digitsByCount[value.length].length === 1) {

//       const n = digitsByCount[value.length][0];
//       const segments = digits[n];
//       for (let i = 0; (i < value.length); i++) {
//         wiring[value[i]] = segments[i];
//       }
//     }
//   }

//   console.log(wiring);
// }

// console.log(JSON.stringify(digitsByCount, null, '  '));


// 2 segments: ** 1
// 4 segments: ** 4
// 3 segments: ** 7
// Segment not shared by 1 and 7: Segment "a"
// 6 segments, shares only one with 1 and 7: 6
// 6 segments, not 6: 9
// segment in 6 not in 9: "e"
// Segment shared by 1, 7, and 6: Segment "f"
// Segment shared by 1 and 7 that is not "f": "c"
// 6 minus one segment: 5
// Segment in 6 absent from 5: "e"
// 5 plus "c" and "e": 0
// 7 segments: 8
// remaining digit that has "c" and "f": 3
// remaining digit: 2

function sortCharacters(s) {
  return s.split('').sort().join('');
}
