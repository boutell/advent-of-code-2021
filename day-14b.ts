import data from './day-14-data';

interface Pair {
  a:string,
  b:string,
  yields:string
};

const [ templateRaw, pairsRaw ] = data.split('\n\n');

const template:Array<string> = templateRaw.split('');
const pairMap:Map<string,Pair> = new Map();
const pairs:Array<Pair> = pairsRaw.split('\n').map(pairRaw => {
  const matches = pairRaw.match(/^([A-Z])([A-Z]) -> ([A-Z])$/);
  if (!matches) {
    throw new Error(`Bad pair input: <${pairRaw}>`);
  }
  const pair = {
    a: matches[1],
    b: matches[2],
    yields: matches[3]
  };
  pairMap.set(`${pair.a}${pair.b}`, pair);
  return pair;
});

let polymer = [...template];

for (let i = 1; (i <= 40); i++) {
  const next = [];
  let first = true;
  for (let j = 0; (j < (polymer.length - 1)); j++) {
    const pair = pairMap.get(`${polymer[i]}${polymer[i + 1]}`);
    if (!pair) {
      throw new Error(`No match found for: ${polymer[j]}${polymer[j+1]}`);
    }
    if (first) {
      next.push(pair.a);
      first = false;
    }
    next.push(pair.yields);
    next.push(pair.b);
  }
  polymer = next;
  const frequencies:Map<string, number> = new Map();
  for (const value of polymer) {
    frequencies.set(value, (frequencies.get(value) || 0) + 1);
  }
  const keys = [...frequencies.keys()];
  
  keys.sort((a, b) => (frequencies.get(b) as number) - (frequencies.get(a) as number));
  const most = frequencies.get(keys[0]) as number;
  const least = frequencies.get(keys[keys.length - 1]) as number;
  console.log(polymer.length, most, least, most - least);
  
}
