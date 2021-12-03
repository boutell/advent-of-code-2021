import { readFileSync as read } from 'fs';

const input:Array<string> = read('day-3.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0);

const oxygenGeneratorRating = reduce(input, 0, (counts:Array<number>) => {
  if (counts[1] > counts[0]) {
    return 1;
  } else if (counts[1] < counts[0]) {
    return 0;
  } else {
    return 1;
  }
});

const co2ScrubberRating = reduce(input, 0, (counts:Array<number>) => {
  if (counts[0] > counts[1]) {
    return 1;
  } else if (counts[0] < counts[1]) {
    return 0;
  } else {
    return 0;
  }
});

console.log(parseInt(oxygenGeneratorRating, 2) * parseInt(co2ScrubberRating, 2));

type Comparator = (counts:Array<number>) => number;

function reduce(input:Array<string>, place:number, comparator:Comparator):string {
  const counts = [ 0, 0 ];
  if (input.length === 1) {
    return input[0];
  } else {
    for (const value of input) {
      const bit = +value[place];
      counts[bit]++;
    }
    const bit = comparator(counts);
    return reduce(input.filter(value => +value[place] === bit), place + 1, comparator);
  }
}
