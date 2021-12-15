import data from './day-14-data';

const iterations = 40;

interface Pair {
  a:string,
  b:string,
  yields:string
};

interface LevelCache {
  n:number,
  result:string|null
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

let total = template.length;
for (let i = 0; (i < iterations); i++) {
  total = total + total - 1;
}
console.log(`There will be ${total} places`);

const frequencies:Map<string, number> = new Map();
const cache:Array<LevelCache> = [];
let char:string|null = null;
let i = 0;

const start = Date.now();
do {
  char = next(iterations, i++);
  if (char) {
    frequencies.set(char, (frequencies.get(char) || 0) + 1);
  }
  if (!(i % 1000000)) {
    const elapsed = Date.now() - start;
    const totalTime = (total / i) * (Date.now() - start);
    const remaining = (totalTime - elapsed) / 1000 / 60 / 60;
    console.log(`${i} (${(i * 100 / total)}%) time remaining: ${remaining} hours`);
  }
} while (char !== null);

const keys = [...frequencies.keys()];
  
keys.sort((a, b) => (frequencies.get(b) as number) - (frequencies.get(a) as number));
const most = frequencies.get(keys[0]) as number;
const least = frequencies.get(keys[keys.length - 1]) as number;
console.log(most, least, most - least);

function next(level:number, n:number):string|null {
  const key = `${level}:${n}`;
  if (cacheHas(level, n)) {
    return cacheGet(level, n);
  }
  const result = nextBody();
  cacheSet(level, n, result);
  return result;
  function nextBody():string|null {
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
}

function cacheSet(level:number, n:number, result:string|null):void {
  cache[level] = {
    n,
    result
  };
}

function cacheGet(level:number, n:number):string|null {
  if (cacheHas(level, n)) {
    return cache[level].result;
  } else {
    throw new Error(`Cache should contain: ${level} ${n}`);
  }
}

function cacheHas(level:number, n:number):boolean {
  return cache[level] && cache[level].n === n;
}
