// TOMORROW:
//
// For each pair (not the whole template),
// Iterate it to depths 1 through n.
//
// For a given iteration i, reuse the frequency
// results for each pair measured in generation i-1
// to avoid actually drilling down, and just sum them.
//
// Then, sum the frequencies for the pairs in the template.
//
// So basically, top down with memoization is correct,
// not bottom up.

import data from './day-14-data';

const iterations = 10;

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

let sum:Map<string,number> = new Map();
for (let i = 0; (i < template.length - 1); i++) {
  const a = template[i];
  const b = template[i + 1];
  const pair = pairMap.get(`${a}${b}`);
  sum = addMaps(sum, getFrequencies(pair as Pair, iterations));
}

const keys = [...sum.keys()];

keys.sort((a, b) => (sum.get(b) as number) - (sum.get(a) as number));
for (const key of keys) {
  console.log(`${key} ${sum.get(key)}`);
}
const most = sum.get(keys[0]) as number;
const least = sum.get(keys[keys.length - 1]) as number;
console.log(most, least, most - least);

function getFrequencies(pair:Pair, iterations:number):Map<string,number> {
  if (iterations === 0) {
    const result:Map<string,number> = new Map();
    result.set(pair.a, 1);
    result.set(pair.b, 1);
    return result;
  } else {
    return addMaps(
      getFrequencies(pairMap.get(`${pair.a}${pair.yields}`) as Pair, iterations - 1),
      getFrequencies(pairMap.get(`${pair.yields}${pair.b}`) as Pair, iterations - 1)
    );
  }
}

function addMaps(a:Map<string,number>, b:Map<string,number>) {
  const result:Map<string,number> = new Map();
  for (const key of a.keys()) {
    result.set(key, a.get(key) as number);
  }
  for (const key of b.keys()) {
    if (!result.has(key)) {
      result.set(key, b.get(key) as number);
    } else {
      result.set(key, (result.get(key) as number) + (b.get(key) as number));
    }
  }
  return result;
}
