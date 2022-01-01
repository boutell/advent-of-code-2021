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

console.log(countGames(0, 0, 4, 0));

function countGames(rolls:number, rollAccumulator:number, position:number, score:number):Map<string,number> {
  let key;
  if (rolls > 15) {
    key = `${rolls}:${rollAccumulator}:${position}:${score}`;
    if (memos.has(key)) {
      return memos.get(key);
    }
  }
  const results = new Map();
  if (!(rolls % 3)) {
    if (rolls > 0) {
      position = position + rollAccumulator;
      position %= 10;
      if (position === 0) {
        score += 10;
      } else {
        score += position;
      }
      if (score >= 21) {
        ends++;
        if (!(ends % 1000000)) {
          console.log(ends);
        }
        results.set(rolls, 1);
        memos.set(key, results);
        return results;
      }
    }
  }
  for (let roll = 1; (roll <= 3); roll++) {
    const rollResults = countGames(rolls + 1, rollAccumulator + roll, position, score);
    for (const [ key, val ] of rollResults.entries()) {
      if (!results.has(key)) {
        results.set(key, 0);
      }
      results.set(key, results.get(key) + val);
    }
  }
  if (rolls > 15) {
    memos.set(key, results);
  }
  return results;
}