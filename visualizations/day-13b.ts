import data from './day-13-data.js';

const ms = 2000;

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
let scale;

const rules = document.styleSheets[0].cssRules;
for (let i = 0; (i < rules.length); i++) {
  console.log(rule);
}

go();

async function go() {
  console.log('in go');
  await zoom();

  for (const fold of folds) {
    if (fold.axis === Axis.y) {
      const folding = points.filter(point => point.y > fold.value);
      for (const point of folding) {
        point.el.style.top = `${fold.value * 100}px`;
        point.el.style.height = '0px';
      }
      await delay(ms);
      for (const point of folding) {
        point.y = fold.value - (point.y - fold.value);
        point.el.style.top = `${point.y * 100}px`;
        point.el.style.height = '100px';
      }
      await delay(ms);
      await zoom();
    } else {
      const folding = points.filter(point => point.x > fold.value);
      for (const point of folding) {
        point.el.style.left = `${fold.value * 100}px`;
        point.el.style.width = '0px';
      }
      await delay(ms);
      for (const point of folding) {
        point.x = fold.value - (point.x - fold.value);
        point.el.style.left = `${point.x * 100}px`;
        point.el.style.width = '100px';
      }
      await delay(ms);
      await zoom();
    }
  }
}

function createEl(x, y) {
  const el = document.createElement('div');
  el.classList.add('point');
  el.style.top = `${y * 100}px`;
  el.style.left = `${x * 100}px`;
  app.appendChild(el);
  return el;
}
 
async function zoom() {
  console.log('in zoom');
  findMaxes();
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  app.style.width = `${width}px`;
  app.style.height = `${height}px`;
  const scaleX = width / (100 * (maxX + 1));
  const scaleY = height / (100 * (maxY + 1));
  scale = Math.min(scaleX, scaleY);
  app.style.transform = `scale(${scale})`;
  console.log(scale);
  if (scale > 0.03) {
    app.classList.remove('small');
  } else {
    app.classList.add('small');
  }
}

function findMaxes() {
  maxY = Math.max(...points.map(point => point.y));
  maxX = Math.max(...points.map(point => point.x));
}

async function delay(ms):Promise<void> {
  return new Promise((resolve, reject) => setTimeout(() => resolve(null), ms));
}
