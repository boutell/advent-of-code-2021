let p1 = 7;
let p2 = 4;
let p1Score = 0;
let p2Score = 0;
let die = 1;
let rolls = 0;

while(true) {
  p1 += roll() + roll() + roll();
  while (p1 > 10) {
    p1 -= 10;
  }
  console.log('1: ' + p1);
  p1Score += p1;
  if (p1Score >= 1000) {
    console.log(p2Score, rolls, rolls * p2Score);
    break;
  }
  p2 += roll() + roll() + roll();
  while (p2 > 10) {
    p2 -= 10;
  }
  console.log('2: ' + p2);
  p2Score += p2;
  if (p2Score >= 1000) {
    console.log(p1Score, rolls, rolls * p1Score);
    break;
  }
}

function roll() {
  const result = die;
  die++;
  if (die === 101) {
    die = 1;
  }
  rolls++;
  console.log('= ' + result);
  return result;
}