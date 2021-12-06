import { readFileSync as read } from 'fs';
const lanternfish:Array<number> = read('day-6.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  [0].split(',')
  .map(n => parseInt(n, 10));

for (let i = 0; (i < 80); i++) {
  let pushCount = 0;
  for (let j = 0; (j < lanternfish.length); j++) {
    lanternfish[j]--;
    if (lanternfish[j] < 0) {
      lanternfish[j] = 6;
      pushCount++;
    }
  }
  for (let j = 0; (j < pushCount); j++) {
    lanternfish.push(8);
  }
}
console.log(lanternfish.length);
