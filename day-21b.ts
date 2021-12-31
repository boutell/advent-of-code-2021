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

let p1Wins = 0;
let p2Wins = 0;

const played = new Set();

console.log(Math.pow(3, 18));
for (let i = 0; (i < Math.pow(3, 18)); i++) {
  if (!(i % 1000000)) {
    console.log(p1Wins, p2Wins);
  }
  let p1Score = 0;
  let p2Score = 0;
  let used = '';
  let turns = 0;
  let dice = i.toString(3).padStart(30, '0');
  while (true) {
    let p1 = 4;
    let p2 = 8;
    turns++;
    p1 += roll() + roll() + roll();
    if (played.has(used)) {
      break;
    }
    while (p1 > 10) {
      p1 -= 10;
    }
    p1Score += p1;
    if (p1Score >= 21) {
      p1Wins++;
      played.add(used);
      break;
    }
    turns++;
    p2 += roll() + roll() + roll();
    if (played.has(used)) {
      break;
    }
    while (p2 > 10) {
      p2 -= 10;
    }
    p2Score += p2;
    if (p2Score >= 21) {
      p2Wins++;
      played.add(used);
      break;
    }
    function roll() {
      used += dice[0];
      const result = parseInt(dice[0]) + 1;
      dice = dice.substring(1, dice.length);
      if (!dice.length) {
        throw new Error(`Ran out of dice in game ${i.toString(3)}`);
      }
      return result;
    }
  }
}

console.log(p1Wins, p2Wins);