import data from './day-13-data';

export default solver;

interface Point {
  x:number,
  y:number
};

enum Axis {
  x,
  y
};

interface Fold {
  axis:Axis,
  value:number
};

interface Solution {
  total:number,
  image:string
};

function solver(limit:number|null):Solution {
  const [ pointsRaw, foldsRaw ] = data.split('\n\n');
  
  const points:Array<Point> = pointsRaw.split('\n').map(s => {
    const [ x, y ] = s.split(',');
    return { x: +x, y: +y };
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
  
  let page:Array<Array<boolean>> = [];
  
  let maxY = Math.max(...points.map(point => point.y));
  let maxX = Math.max(...points.map(point => point.x));
  for (let y = 0; (y <= maxY); y++) {
    page[y] = [];
    for (let x = 0; (x <= maxX); x++) {
      page[y][x] = false;
    }
  }
  
  for (const point of points) {
    page[point.y][point.x] = true;
  }
  
  for (let i = 0; (i < (limit || folds.length)); i++) {
    const fold = folds[i];
    if (fold.axis === Axis.y) {
      for (let y = fold.value + 1; (y <= maxY); y++) {
        for (let x = 0; (x <= maxX); x++) {
          const foldY = fold.value - (y - fold.value);
          page[foldY][x] ||= page[y][x]; 
        }
      }
      page = page.slice(0, fold.value);
      maxY = fold.value - 1;
    } else if (fold.axis === Axis.x) {
      for (let y = 0; (y <= maxY); y++) {
        for (let x = fold.value + 1; (x <= maxX); x++) {
          const foldx = fold.value - (x - fold.value);
          page[y][foldx] ||= page[y][x]; 
        }
      }
      page = page.map(row => row.slice(0, fold.value));
      maxX = fold.value - 1;
    } else {
      throw new Error(`unknown axis: ${fold.axis}`);
    }
  }
  
  return {
    total:page.flat().reduce((a, v) => a + (v ? 1 : 0), 0),
    image: renderPage()
  }; 
  
  function renderPage():string {
    return page.map(line => line.map(value => value ? '#' : '.').join('')).join('\n') + '\n';
  }
}
