import { readFileSync as read } from 'fs';

enum Direction {
  forward = 'forward',
  up = 'up',
  down = 'down'
}

const directionNames:Array<string> = Object.values(Direction);

interface Command {
  direction: Direction,
  distance: number
};

const input:Array<Command> = read('day-2.txt', { encoding: 'utf8' })
  .split('\n')
  .map(line => line.trim())
  .filter(line => line.length > 0)
  .map(line => {
    const [ directionName, distance ] = line.split(' ');
    if (!directionNames.includes(directionName)) {
      throw new Error(`Invalid direction: ${directionName}`);
    }
    const command: Command = {
      direction: directionName as Direction,
      distance: +distance
    };
    return command;
  });

let position = 0, depth = 0;

const actions = {
  [Direction.forward]: (value:number) => {
    position += value;
  },
  [Direction.up]: (value:number) => {
    depth -= value;
  },
  [Direction.down]: (value:number) => {
    depth += value;
  },
};

for (const command of input) {
  actions[command.direction](command.distance);
}

console.log(position * depth);
