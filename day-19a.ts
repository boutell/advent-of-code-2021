import { readFileSync as read } from 'fs';

type Report = Array<Coord>;

type Coord = [ number, number, number ];

const lines = read('day-19.txt', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(row => row.length > 0);

let reports:Array<Report> = [];
let report:Array<Coord> = [];
for (const line of lines) {
  if (line.match(/^---/)) {
    flush();
  } else {
    const data = line.split(',');
    if (data.length !== 3) {
      throw new Error(`Unexpected data: ${data}`);
    }
    // Why do I have to cast this? I checked the length
    report.push(data.map(datum => parseInt(datum)) as Coord);
  }
}
flush();

let beacons:Set<string> = new Set();

for (const beacon of reports[0]) {
  beacons.add(beacon.join(':'));
}

let pass = 0;
while (reports.length > 1) {
  iterator: for (let i = 0; (i < reports.length); i++) {
    for (let j = i + 1; (j < reports.length); j++) {
      if (correlate(reports[i], reports[j])) {
        reports = [...reports.slice(0, j), ...reports.slice(j + 1)];
        break iterator;
      }
    }
  }
}
console.log(reports[0].length);

function flush() {
  if (report.length) {
    reports.push(report);
    report = [];
  }
}

function correlate(a:Report, b:Report):boolean {
  for (let facing = 0; (facing < 6); facing++) {
    for (let rotation = 0; (rotation < 4); rotation++) {
      const differences = new Map();
      const oriented = orient(b, facing, rotation);
      for (let i = 0; (i < a.length); i++) {
        for (let j = 0; (j < oriented.length); j++) {
          const difference = `${oriented[j][0] - a[i][0]}:${oriented[j][1] - a[i][1]}:${oriented[j][2] - a[i][2]}`;
          if (!differences.has(difference)) {
            differences.set(difference, []);
          }
          differences.get(difference).push([ i, j ]);
        }
      }
      const keys = [...differences.keys()];
      keys.sort((a, b) => {
        return differences.get(b).length - differences.get(a).length;
      });
      const correlation = differences.get(keys[0]).length;
      if (correlation >= 12) {
        const difference = keys[0].split(':').map((s:string) => parseInt(s));
        console.log(difference);
        for (const beacon of oriented) {
          const translated = beacon.map((axis, i) => axis - difference[i]);
          if (!a.find(coord => coord.join(':') === translated.join(':'))) {
            a.push(translated as Coord);
          }
        }
        return true;
      }
    }
  }
  return false;
}

function orient(report:Array<Coord>, facing:number, rotation:number) {
  const facings = [
    [ [ 0, 1 ], [ 1, 1 ], [ 2, 1 ] ],
    [ [ 2, 1 ], [ 1, 1 ], [ 0, -1 ] ],
    [ [ 0, -1 ], [ 1, 1 ], [ 2, -1 ] ],
    [ [ 2, -1 ], [ 1, 1 ], [ 0, 1 ] ],
    [ [ 0, 1 ], [ 2, -1 ], [ 1, 1 ] ],
    [ [ 0, 1 ], [ 2, 1 ], [ 1, -1 ] ]
  ];
  const rotate = [
    [ 1, 1 ], [ 0, -1 ], [ 2, 1 ]
  ];
  return report.map(coord => {
    let oriented = facings[facing].map((rule, i) => coord[rule[0]] * rule[1]);
    for (let i = 0; (i < rotation); i++) {
      oriented = oriented.map((axis, i) => oriented[rotate[i][0]] * rotate[i][1]);
    }
    return oriented;
  });
}