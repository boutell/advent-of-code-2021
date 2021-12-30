import { readFileSync as read } from 'fs';

const lines = read('day-20.txt', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(row => row.length > 0);

const algorithm = lines[0].split('').map(s => (s === '#') ? 1 : 0);
const imageInput = lines.slice(1).map(line => line.split('').map(s => (s === '#') ? 1 : 0));
console.log(imageInput.length);
let image:Array<Array<0|1>> = [];

for (let y = 0; (y < imageInput.length); y++) {
  for (let x = 0; (x < imageInput[y].length); x++) {
    const row = imageInput[y];
    set(image, x, y, imageInput[y][x]);
  }
}

const height = imageInput.length;
const width = imageInput[0].length;

console.log(width, height);

for (let i = 0; (i < 50); i++) {
  image = iterate(image);
}
console.log(render(image));

let ones = 0;
// Ignore the outer fringes where we get in trouble because
// our simulation of infinity is necessarily incomplete and
// the bits are flipping from one back to zero
for (let y = -75; (y < height + 75); y++) {
  for (let x = -75; (x < width + 75); x++) {
    ones += get(image, x, y);
  }
}

console.log(ones);

function iterate(image:Array<Array<0|1>>):Array<Array<0|1>> {
  const next:Array<Array<0|1>> = [];
  for (let y = -300; (y < height + 300); y++) {
    for (let x = -300; (x < width + 300); x++) {
      let value = 0;
      for (let py = y - 1; (py <= y + 1); py++) {
        for (let px = x - 1; (px <= x + 1); px++) {
          value <<= 1;
          const bit = get(image, px, py);
          value += bit;
        }
      }
      set(next, x, y, algorithm[value]);
    }
  }
  return next;
}

function set(image:Array<Array<0|1>>, x:number, y:number, bit:0|1) {
  x += 300;
  y += 300;
  if ((x < 0) || (y < 0)) {
    throw new Error('Out of range');
  }
  if ((bit !== 0) && (bit !== 1)) {
    throw new Error('Invalid bit value');
  }
  image[y] = image[y] || [];
  image[y][x] = bit;
}

function get(image:Array<Array<0|1>>, x:number, y:number):0|1 {
  x += 300;
  y += 300;
  if ((x < 0) || (y < 0)) {
    return 0;
  }
  const row = image[y];
  if (!row) {
    return 0;
  }
  return (row[x] === 1) ? 1 : 0;
}

function render(image:Array<Array<0|1>>) {
  return image.map(row => row.join('')).join('\n');
}