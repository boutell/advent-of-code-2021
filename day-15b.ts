import { readFileSync as read } from 'fs';

const map:Array<Array<number>> = read('day-15.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => line.split('').map(v => parseInt(v, 0)));

const h = map.length;
const w = map[0].length;

for (let y = 0; (y < 5); y++) {
  for (let x = 0; (x < 5); x++) {
    if (!(x || y)) {
      continue;
    }
    for (let iy = 0; (iy < h); iy++) {
      const cy = y * h + iy;
      if (!map[cy]) {
        map[cy] = [];
      }
      for (let ix = 0; (ix < w); ix++) {
        const cx = x * w + ix;
        map[cy][cx] = (((map[iy][ix] + x + y) - 1) % 9) + 1;
      }
    }
  }
}
  
interface Edge {
  a:string,
  b:string,
  cost:number
};

const graph:Map<string,Edge> = new Map();
for (let y = 0; (y < map.length); y++) {
  for (let x = 0; (x < map[0].length); x++) {
    if (y > 0) {
      addEdge({
        a: `${x},${y}`,
        b: `${x},${y-1}`,
        cost: map[y-1][x]
      });
    }
    if (x > 0) {
      addEdge({
        a: `${x},${y}`,
        b: `${x-1},${y}`,
        cost: map[y][x-1]
      });
    }
    if (y < (map.length - 1)) {
      addEdge({
        a: `${x},${y}`,
        b: `${x},${y+1}`,
        cost: map[y+1][x]
      });
    }
    if (x < (map[0].length - 1)) {
      addEdge({
        a: `${x},${y}`,
        b: `${x+1},${y}`,
        cost: map[y][x+1]
      });      
    }
  }
}

function addEdge(edge:Edge) {
  graph.set(`${edge.a}:${edge.b}`, edge);
}

const { distance, previous } = dijkstra(graph, '0,0');
printPath(distance, previous, `${map[0].length-1},${map.length-1}`, '0,0');

function printPath(distance:Map<string,number>, previous:Map<string, string|null>, destination:string, source:string) {
  let cost = 0;
  do {
    console.log(destination);
    const a = previous.get(destination)!;
    cost += graph.get(`${a}:${destination}`)!.cost;
    destination = a;
  } while (destination !== source);
  console.log(`Cost: ${cost}`);
}

function dijkstra(graph:Array<Edge>, source:string) {
  const vertexes:Set<string> = new Set();
  const distance:Map<string, number> = new Map();
  const previous:Map<string, string|null> = new Map();
  for (const edge of graph) {
    add(edge.a);
    add(edge.b);
    function add(name:string) {
      vertexes.add(name);
      distance.set(name, Infinity);
      previous.set(name, null);
    }
  }
  distance.set(source, 0);
  const start = Date.now();
  const initialSize = vertexes.size;
  while (vertexes.size > 0) {
    if (!(vertexes.size % 100)) {
      const now = Date.now();
      const proportion = (initialSize - vertexes.size) / initialSize;
      console.log(((now - start) / proportion) / 1000 / 60);
    }
    let least:string|null = null;
    for (const name of vertexes) {
      if ((least === null) || (distance.get(name)! < distance.get(least)!)) {
        least = name;
      }
    }
    vertexes.delete(least!);
    for (const edge of graph) {
      if (edge.a === least) {
        if (vertexes.has(edge.b)) {
          const alt = distance.get(least)! + edge.cost;
          const bDist = distance.get(edge.b)!;
          if (alt < bDist) {
            distance.set(edge.b, alt);
            previous.set(edge.b, least);
          }
        }
      }
    }
  }
  return {
    previous,
    distance
  };
}

// function Dijkstra(Graph, source):
//  2
//  3      create vertex set Q
//  4
//  5      for each vertex v in Graph:            
//  6          dist[v] ← INFINITY                 
//  7          prev[v] ← UNDEFINED                
//  8          add v to Q                     
//  9      dist[source] ← 0                       
// 10     
// 11      while Q is not empty:
// 12          u ← vertex in Q with min dist[u]   
// 13                                             
// 14          remove u from Q
// 15         
// 16          for each neighbor v of u still in Q:
// 17              alt ← dist[u] + length(u, v)
// 18              if alt < dist[v]:              
// 19                  dist[v] ← alt
// 20                  prev[v] ← u
// 21
// 22      return dist[], prev[]