import { readFileSync as read } from 'fs';

const input = read('day-8.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => {
    const parts = line.trim().split(' | ');
    return {
      signals: parts[0].split(' ').map(splitAndSortCharacters),
      output: parts[1].split(' ').map(splitAndSortCharacters)
    }
  });

const segments = [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ];

let sum = 0;
for (const display of input) {
  const digits = [];
  // 2 segments: ** 1
  // 4 segments: ** 4
  // 3 segments: ** 7
  digits[1] = display.signals.find(signal => signal.length === 2);
  digits[4] = display.signals.find(signal => signal.length === 4);
  digits[7] = display.signals.find(signal => signal.length === 3);
  // contains all of 7 and has 5 segments
  digits[3] = display.signals.find(signal => (signal.length === 5) && !digits[7].find(value => !signal.includes(value)));
  digits[8] = display.signals.find(signal => signal.length === 7);
  // 6 segments, shares only one with 1: 6
  digits[6] = display.signals.find(signal => (signal.length === 6) && (digits[1].filter(value => signal.includes(value)).length === 1));
  // 6 segments, shares all with 7, all with 3: 9
  digits[9] = display.signals.find(signal => (signal.length === 6) && (!digits[7].find(value => !signal.includes(value))) && (!digits[3].find(value => !signal.includes(value))));
  // remaining 6 segment digit: 0
  digits[0] = display.signals.find(signal => (signal.length === 6) && !digits.includes(signal));
  // segment "f": shared by 1, 7 and 6
  const f = segments.find(segment => digits[1].includes(segment) && digits[7].includes(segment) && digits[6].includes(segment));
  // segment shared by 1 and 7 that is not "f": "c"
  const c = segments.find(segment => digits[1].includes(segment) && digits[7].includes(segment) && segment !== f);
  // 6 minus one segment: 5
  digits[5] = display.signals.find(signal => (signal.length === 5) && (!signal.find(value => !digits[6].includes(value))));
  // Segment in 6 absent from 5: "e"
  const e = digits[6].find(value => !digits[5].includes(value));
  // remaining digit: 2
  digits[2] = display.signals.find(signal => !digits.includes(signal));
  const result = display.output.map(value => digits.findIndex(digit => digit.join('') === value.join(''))).join('');
  sum += parseInt(result, 0);
}

console.log(sum);

function compact(a) {
 return a.map((v, i) => i + ': ' + v.join('')).join('\n');
}
     
function splitAndSortCharacters(s) {
  return s.split('').sort();
}
