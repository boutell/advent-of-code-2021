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

const iterations = 40;

interface Pair {
  a:string,
  b:string,
  yields:string
};

type Frequencies = Map<string,number>;

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

let sum:Frequencies = new Map();
const memos:Map<string,Frequencies> = new Map();

for (let i = 0; (i < template.length); i++) {
  sum = addMaps(sum, getMapOfOne(template[i]));
}

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

function getFrequencies(pair:Pair, iterations:number):Frequencies {
  const memoKey = JSON.stringify({ pair, iterations });
  if (memos.has(memoKey)) {
    return memos.get(memoKey) as Frequencies;
  }
  const result = getFrequenciesBody();
  memos.set(memoKey, result);
  return result;
  function getFrequenciesBody() {
    if (iterations === 1) {
      return getMapOfOne(pair.yields);
    } else {
      return addMaps(
        getFrequencies(pairMap.get(`${pair.a}${pair.yields}`) as Pair, iterations - 1),
        getFrequencies(pair, 1),
        getFrequencies(pairMap.get(`${pair.yields}${pair.b}`) as Pair, iterations - 1)
      );
    }
  }
}

function addMaps(...maps:Array<Frequencies>) {
  const result:Frequencies = new Map();
  for (const map of maps) {
    for (const key of map.keys()) {
      if (!result.has(key)) {
        result.set(key, map.get(key) as number);
      } else {
        result.set(key, (result.get(key) as number) + (map.get(key) as number));
      }
    }
  }
  return result;
}

function getMapOfOne(char:string):Frequencies {
  const result:Frequencies = new Map();
  result.set(char, 1);
  return result;
}