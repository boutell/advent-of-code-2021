import { readFileSync as read } from 'fs';

const data:Array<Array<Array<boolean>>> = [];

const rules = read('day-22.txt', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(row => row.length > 0)
  .map(line => {
    const matches = line.match(/^(on|off) x=([-\d]+)\.\.([-\d]+),y=([-\d]+)\.\.([-\d]+),z=([-\d]+)\.\.([-\d]+)/);
    if (!matches) {
      throw new Error(`invalid input: ${line}`);
    }
    return {
      value: (matches[1] === 'on'),
      x: [ parseInt(matches[2]), parseInt(matches[3]) ],
      y: [ parseInt(matches[4]), parseInt(matches[5]) ],
      z: [ parseInt(matches[6]), parseInt(matches[7]) ]
    };
  });

for (const rule of rules) {
  for (let z = Math.max(rule.z[0], -50); (z <= Math.min(rule.z[1], 50)); z++) {
    for (let y = Math.max(rule.y[0], -50); (y <= Math.min(rule.y[1], 50)); y++) {
      for (let x = Math.max(rule.x[0], -50); (x <= Math.min(rule.x[1], 50)); x++) {
        set(x, y, z, rule.value);
      }
    }
  }
}

let count = 0;

for (let z = -50; (z <= 50); z++) {
  for (let y = -50; (y <= 50); y++) {
    for (let x = -50; (x <= 50); x++) {
      if (get(x, y, z)) {
        count++;
      }
    }
  }
}

console.log(count);

function set(x:number, y:number, z:number, value:boolean) {
  if (guard(x) || guard(y) || guard(z)) {
    return;
  }
  x += 50;
  y += 50;
  z += 50;
  data[z] = data[z] || [];
  data[z][y] = data[z][y] || [];
  data[z][y][x] = value;
}

function get(x:number, y:number, z:number):boolean {
  if (guard(x) || guard(y) || guard(z)) {
    return false;
  }
  return data?.[z+50]?.[y+50]?.[x+50];
}

function guard(x:number):boolean {
  return (x < -50) || (x > 50);
}
