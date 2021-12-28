import { readFileSync as read } from 'fs';

interface Literal {
  type:'literal',
  value:number,
  leftPeer:Literal|null,
  rightPeer:Literal|null
};

interface Sum {
  type: 'sum',
  left: Value,
  right: Value
};

type Value = Literal | Sum;

const values = read('day-18.txt', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(row => row.length > 0)
  .map(row => parse(row, 0)[0]);

let high = -Infinity;

for (let i = 0; (i < values.length); i++) {
  for (let j = 0; (j < values.length); j++) {
    if (i === j) {
      continue;
    }
    let sum:Sum = {
      type: 'sum',
      left: clone(values[i]),
      right: clone(values[j]),
    };
    let change = false;
    do {
      console.log('annotating');
      annotate(sum, null);
      console.log('transforming');
      change = transformSums(sum, 0);
      if (!change) {
        change = transformLiterals(sum, 0);
      }
      console.log(render(sum));
    } while (change);
    const m = magnitude(sum);
    if (m > high) {
      high = m;
    }
  }
}

console.log(high);

function parse(row:string, n:number):[Value, number] {
  const matches = row.substring(n).match(/^\d+/);
  if (matches) {
    return [
      {
        type: 'literal',
        leftPeer: null,
        rightPeer: null,
        value: parseInt(matches[0]),
      },
      n + matches[0].length
    ];
  }
  if (row[n] !== '[') {
    throw new Error(`${row.substring(n)} does not start with [`);
  }
  let left;
  [ left, n ] = parse(row, n + 1);
  if (row[n] !== ',') {
    throw new Error(`${row.substring(n)} does not contain , after its left clause`);
  }
  let right;
  [ right, n ] = parse(row, n + 1);
  if (row[n] !== ']') {
    throw new Error(`${row.substring(n)} does not contain ] after its right clause`);
  }
  n++;
  return [
    {
      type: 'sum',
      left,
      right
    },
    n
  ];
}

function annotate(value:Value, last:Literal|null):Literal|null {
  if (value.type === 'literal') {
    const literal = value as Literal;
    if (last) {
      last.rightPeer = literal;
    }
    literal.leftPeer = last;
    literal.rightPeer = null;
    return literal;
  } else if (value.type === 'sum') {
    last = annotate(value.left, last);
    last = annotate(value.right, last);
    return last;
  }
  throw new Error('Should not be able to get here');
}

function transformSums(value:Value, depth:number):boolean {
  if (value.type === 'sum') {
    const sum = value as Sum;
    if (depth === 4) {
      if (sum.left.type !== 'literal') {
        throw new Error('Unexpected non-literal');
      }
      if (sum.right.type !== 'literal') {
        throw new Error('Unexpected non-literal');
      }
      const leftPeer = sum.left.leftPeer;
      const rightPeer = sum.right.rightPeer;
      if (leftPeer) {
        leftPeer.value += sum.left.value;
      }
      if (rightPeer) {
        rightPeer.value += sum.right.value;
      }
      const transient = value as any;
      transient.type = 'literal';
      delete transient.left;
      delete transient.right;
      const literal = transient as Literal;
      literal.value = 0;
      return true;
    } else {
      return transformSums(sum.left, depth + 1) || transformSums(sum.right, depth + 1);
    }
  } else {
    return false;
  }
}

function transformLiterals(value:Value, depth:number):boolean {
  if (value.type === 'literal') {
    const literal = value as Literal;
    if (literal.value >= 10) {
      const transient = value as any;
      const literalValue = literal.value;
      delete transient.value;
      const sum = transient as Sum;
      sum.type = 'sum';
      sum.left = {
        type: 'literal',
        leftPeer: null,
        rightPeer: null,
        value: Math.floor(literalValue / 2)
      };
      sum.right = {
        type: 'literal',
        leftPeer: null,
        rightPeer: null,
        value: Math.ceil(literalValue / 2)
      };
      return true;
    }
    return false;
  } else {
    const sum = value as Sum;
    return transformLiterals(sum.left, depth + 1) || transformLiterals(sum.right, depth + 1);
  }
}

function magnitude(value:Value):number {
  if (value.type === 'literal') {
    return value.value;
  } else if (value.type === 'sum') {
    return magnitude(value.left) * 3 + magnitude(value.right) * 2;
  }
  throw new Error('Invalid type');
}

function render(value:Value):string {
  if (value.type === 'literal') {
    return `${value.value}`;
  } else if (value.type === 'sum') {
    return `[${render(value.left)},${render(value.right)}]`;
  }
  throw new Error('Should not be able to get here');
}

function clone(value:Value):Value {
  return JSON.parse(JSON.stringify(value)) as Value;
}