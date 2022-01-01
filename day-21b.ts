// it's a one way hash function, so I have to simulate the games.
//
// how do I enumerate all of the games cleanly? I can iterate the possible
// die rolls, but that doesn't tell me when the games will stop. Then again
// nothing much does. I can handle that by iterating all combos of a sufficient
// number of die rolls and tracking games seen before but that requires
// goofybytes of memory.
//
// can I work backwards from 21 and an end position?
//
// games that end at 1, 21
// games that end at 2, 21
// ...              10, 21
//
// There are so many games because there are two players. But really it's
// about how many games for a player starting from position x end in turns
// y1, y2, y3, etc. Then we can compare those numbers for a player starting
// from position y and multiply and add and stuff.
//
// So simulate 1 player games and see what you can do with that data.

const memos = new Map();

let ends = 0;

console.log(countGames(0, 0, 7, 0, 4, 0));

function countGames(rolls:number, rollAccumulator:number, p1:number, p1Score:number, p2:number, p2Score:number):Array<number> {
  let key;
  if (rolls > 15) {
    key = `${rolls}:${rollAccumulator}:${p1}:${p1Score}:${p2}:${p2Score}`;
    if (memos.has(key)) {
      return memos.get(key);
    }
  }
  if (!((rolls - 3) % 6)) {
    p1 += rollAccumulator;
    p1 %= 10;
    if (p1 === 0) {
      p1Score += 10;
    } else {
      p1Score += p1;
    }
    if (p1Score >= 21) {
      ends++;
      if (!(ends % 1000000)) {
        console.log(ends);
      }
      const results = [ 1, 0 ];
      memos.set(key, results);
      return results;
    }
    rollAccumulator = 0;
  } else if ((rolls > 0) && (!(rolls % 6))) {
    p2 += rollAccumulator;
    p2 %= 10;
    if (p2 === 0) {
      p2Score += 10;
    } else {
      p2Score += p2;
    }
    if (p2Score >= 21) {
      ends++;
      if (!(ends % 1000000)) {
        console.log(ends);
      }
      const results = [ 0, 1 ];
      memos.set(key, results);
      return results;
    }
    rollAccumulator = 0;
  }
  const results = [ 0, 0 ];
  for (let roll = 1; (roll <= 3); roll++) {
    const rollResults = countGames(rolls + 1, rollAccumulator + roll, p1, p1Score, p2, p2Score);
    results[0] += rollResults[0];
    results[1] += rollResults[1];
  }
  if (rolls > 15) {
    memos.set(key, results);
  }
  return results;
}