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

spelunk('start', [ 'start' ], []);

console.log(paths.map(path => path.join(',')).join('\n'));

function spelunk(where:string, path:Array<string>, used:Array<Link>) {
  if (where === 'end') {
    paths.push(path);
  } else {
    links.filter(link => (link.from === where) && (!used.includes(link)))
      .filter(link => !(path.includes(link.to) && (link.to.charAt(0) === link.to.charAt(0).toLowerCase())))
      .forEach(link => spelunk(link.to, [ ...path, link.to ], [ ...used, link ]));
  }
}


