import { readFileSync as read } from 'fs';

interface Command {
  direction: string,
  distance: number
};

const input:Array<Command> = read('day-2.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => {
    const components:Array<string> = line.split(' ');
    const command: Command = {
      direction: components[0],
      distance: +components[1]
    };
    return command;
  });

let position = 0, depth = 0;

for (const command of input) {
  if (command.direction === 'forward') {
    position += command.distance;
  } else if (command.direction === 'down') {
    depth += command.distance;
  } else if (command.direction === 'up') {
    depth -= command.distance;
  }
}

console.log(position * depth);
