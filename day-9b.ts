import { readFileSync as read } from 'fs';

interface Cell {
  height: number,
  basin: number
};

const map:Array<Array<Cell>> = read('day-9.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split('').map(v => ({
    height: parseInt(v, 0),
    basin: 0
  })));

let next = 1;

comparePeers((x, y, value, peers) => {
  if (!peers.find(peer => peer.height <= value.height)) {
    map[y][x].basin = next++;
  }
});

printBasins();

let changed = false;
do {
  changed = false;
  comparePeers((x, y, value, peers) => {
    if (value.basin) {
      return;
    }
    if (value.height === 9) {
      return;
    }
    const basinPeer = peers.find(peer => peer.basin && (peer.height <= value.height));
    if (basinPeer) {
      map[y][x].basin = basinPeer.basin;
      changed = true;
    }
  });
  printBasins();
} while (changed);

let basinSizes:Array<number> = [];
for (let i = 1; (i < next); i++) {
  basinSizes[i] = 0;
}   
for (let y = 0; (y < map.length); y++) {
  for (let x = 0; (x < map[y].length); x++) {
    const basin = map[y][x].basin;
    basinSizes[basin]++;
  }
}

basinSizes = basinSizes.slice(1);
basinSizes.sort((a, b) => b - a);
console.log(basinSizes);
console.log(basinSizes[0] * basinSizes[1] * basinSizes[2]);

function comparePeers(fn:(x:number, y:number, value:Cell, peers:Array<Cell>) => void) {
  for (let y = 0; (y < map.length); y++) {
    for (let x = 0; (x < map[y].length); x++) {
      const peers = [];
      if (y > 0) {
        peers.push(map[y - 1][x]);
      } 
      if (x > 0) {
        peers.push(map[y][x - 1]);
      }
      if (y < (map.length - 1)) {
        peers.push(map[y + 1][x]);
      }
      if (x < (map[y].length - 1)) {
        peers.push(map[y][x + 1]);
      }
      fn(x, y, map[y][x], peers);
    } 
  }
}

function printBasins() {
  console.log(map.map(row => row.map(cell => cell.basin).join('')).join('\n'));
  console.log('\n\n');
}
