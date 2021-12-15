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

const frequencies:Map<string, number> = new Map();

let char:string|null = null;
let i = 0;
let result = '';
do {
  char = next(40, i++);
  if (char) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
    result += char;
  }
} while (char !== null);

const keys = [...frequencies.keys()];
  
keys.sort((a, b) => (frequencies.get(b) as number) - (frequencies.get(a) as number));
const most = frequencies.get(keys[0]) as number;
const least = frequencies.get(keys[keys.length - 1]) as number;
console.log(most, least, most - least);

function next(level:number, n:number):string|null {
  if (n === 0) {
    return template[0];
  } else if (level === 0) {
    return template[n];
  } else {
    if (!(n & 1)) {
      return next(level - 1, (n >> 1));
    } else {
      const a = next(level - 1, (n >> 1));
      const b = next(level - 1, (n >> 1) + 1);
      if (!(a && b)) {
        return null;
      }
      const key = `${a}${b}`;
      if (!pairMap.get(key)) {
        throw new Error(`Invalid key: ${key}`);
      }
      return (pairMap.get(key) as Pair).yields;
    }
  }
}
