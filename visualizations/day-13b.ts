import data from './day-13-data.js';

interface Point {
  x:number,
  y:number,
  el:HTMLDivElement
};

enum Axis {
  x,
  y
};

interface Fold {
  axis:Axis,
  value:number
};

const app = document.getElementById('app');

const [ pointsRaw, foldsRaw ] = data.split('\n\n');

const points:Array<Point> = pointsRaw.split('\n').map(s => {
  const [ x, y ] = s.split(',');
  return {
    x: +x,
    y: +y,
    el: createEl(x, y)
  };
});

const folds:Array<Fold> = foldsRaw.split('\n').map(s => {
  const matches = s.match(/fold along (x|y)=(\d+)/);
  if (matches) {
    const [ dummy, axis, value ] = matches;
    return { axis: (Axis as any)[axis], value: +value }; // Axis[+axis] as Axis, value: +value };
  } else {
    throw new Error(`Bad input: ${s}`);
  }
});

let maxY:number;
let maxX:number;

go();

async function go() {
  await zoom();

  for (const fold of folds) {
    if (fold.axis === Axis.y) {
      for (const point of points) {
        if (point.y > fold.value) {
          point.y = fold.value - (point.y - fold.value);
          point.el.style.top = `${point.y}px`;
        }
      }
      await zoom();
    } else {
      for (const point of points) {
        if (point.x > fold.value) {
          point.x = fold.value - (point.x - fold.value);
          point.el.style.left = `${point.x}px`;
        }
      }
      await zoom();
    }
  }
}

function createEl(x, y) {
  const el = document.createElement('div');
  el.classList.add('point');
  el.style.top = `${y}px`;
  el.style.left = `${x}px`;
  app.appendChild(el);
  return el;
}
 
async function zoom() {
  findMaxes();
  const width = document.documentElement.clientWidth;
  app.style.width = `${width}px`;
  const scale = width / (maxX + 1);
  app.style.transform = `scale(${scale})`;
  await delay(1000);
}

function findMaxes() {
  maxY = Math.max(...points.map(point => point.y));
  maxX = Math.max(...points.map(point => point.x));
}

async function delay(ms):Promise<void> {
  return new Promise((resolve, reject) => setTimeout(() => resolve(null), ms));
}
