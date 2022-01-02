import { readFileSync as read } from 'fs';

interface cuboid {
  value: boolean,
  x:[number, number],
  y:[number, number],
  z:[number, number]
};

const rules:Array<cuboid> = read('day-22.txt', { encoding: 'utf8' })
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

let world:Array<cuboid> = [
  {
    value: false,
    x: [ Math.min(...rules.map(rule => rule.x[0])), Math.max(...rules.map(rule => rule.x[1])) ],
    y: [ Math.min(...rules.map(rule => rule.y[0])), Math.max(...rules.map(rule => rule.y[1])) ],
    z: [ Math.min(...rules.map(rule => rule.z[0])), Math.max(...rules.map(rule => rule.z[1])) ]
  }
];

for (const rule of rules) {
  let nextWorld:Array<cuboid> = [];
  for (const cuboid of world) {
    nextWorld = [...nextWorld, sans(world, rule) ];
  }
  nextWorld.push(rule);
  world = nextWorld;
}

let count = 0;

for (const cuboid of world) {
  count += (cuboid.x[1] - cuboid.x[0]) * (cuboid.y[1] - cuboid.y[0]) * (cuboid.z[1] - cuboid.z[0]);
}

console.log(count);

function sans(context, chunk) {
  
}