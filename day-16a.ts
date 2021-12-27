import { readFileSync as read } from 'fs';

interface Literal {
  version:number,
  typeId:4,
  value:number
};

interface Operator {
  version:number,
  typeId:number,
  subpackets:Array<Packet>
};

type Packet = Literal | Operator;

let data = read('day-16.txt', { encoding: 'utf8' }).trim();

let buffer = '';
let bitsRead = 0;
let versionSum = 0;

console.log(JSON.stringify(readPacket(), null, '  '));

console.log(versionSum);

function readPacket():Packet {
  const version = readBits(3);
  versionSum += version;
  const typeId = readBits(3);
  if (typeId === 4) {
    let start;
    let value = 0;
    do {
      start = readBits(1);
      const nibble = readBits(4);
      value <<= 4;
      value += nibble;
    } while (start);
    return {
      version,
      typeId,
      value
    };
  } else {
    const lengthTypeId = readBits(1);
    const subpackets = [];
    if (lengthTypeId) {
      const n = readBits(11);
      for (let i = 0; (i < n); i++) {
        subpackets.push(readPacket());
      }
    } else {
      const bitsOfSubpackets = readBits(15);
      const startFrom = bitsRead;
      while (bitsRead < startFrom + bitsOfSubpackets) {
        subpackets.push(readPacket());
      }
    }
    return {
      version,
      typeId,
      subpackets
    };
  }
}

function readBits(n:number):number {
  let result = 0;
  while (n > 0) {
    result <<= 1;
    n--;
    if (!buffer.length) {
      buffer = parseInt(data.charAt(0), 16).toString(2).padStart(4, '0');
      data = data.substring(1);
    }
    result += parseInt(buffer.charAt(0), 2);
    buffer = buffer.substring(1);
    bitsRead++;
  }
  return result;
}
