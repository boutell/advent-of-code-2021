import { readFileSync as read } from 'fs';

interface Link {
  from:string,
  to:string
};

const links:Array<Link> = read('day-12.txt', { encoding: 'utf8' })
  .split('\n')
  .filter(line => line.length > 0)
  .map(line => {
    const [ from, to ] = line.trim().split('-');
    return [
      {
        from,
        to
      },
      {
        from: to,
        to: from
      }
    ];
  })
  .flat();

const starts = links.find(path => path.from === 'start');

const paths:Array<Array<string>> = [];

spelunk('start', [ 'start' ]);

console.log(paths.map(path => path.join(',')).join('\n'));

function spelunk(where:string, path:Array<string>) {
  if (where === 'end') {
    paths.push(path);
  } else {
    links.filter(link => (link.from === where))
      .filter(link => {
        const to = link.to;
        if (!path.includes(link.to)) {
          return true;
        }
        if ((to === 'start') || (to === 'end')) {
          return false;
        }
        if (link.to.charAt(0) !== link.to.charAt(0).toLowerCase()) {
          return true;
        }
        if (path.filter(where => where === link.to).length !== 1) {
          return false;
        }
        const counts = new Map();
        for (const where of path) {
          if (where.charAt(0) === where.charAt(0).toLowerCase()) {
            counts.set(where, counts.get(where) || 0);
            counts.set(where, counts.get(where) + 1);
            if (counts.get(where) === 2) {
              return false;
            }
          }
        }
        return true; 
      })
      .forEach(link => spelunk(link.to, [ ...path, link.to ]));
  }
}


