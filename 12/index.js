const P = require('parsimmon');
const parseInt = n => Number.parseInt(n, 10);
const program = P.seqMap(
  P.digits.map(parseInt),
  P.string('<->').wrap(P.optWhitespace, P.optWhitespace)
    .then(
      P.digits
        .trim(P.optWhitespace)
        .sepBy(P.string(','))
        .map(arr => arr.filter(v => v).map(parseInt))
    )
    .skip(P.eof),
  (programId, outputs) => [programId, outputs]
);

const input = new Map(
  require('fs').readFileSync('./input.txt', 'utf8')
    .split('\n')
    .map(p => program.tryParse(p))
);

const groupZero = input => {
  input = new Map([...input.entries()]);
  const canZero = new Set([0]);

  for (let pid of canZero.values()) {
    [...input.entries()]
      .filter(([newPid, outputs]) => outputs.includes(pid))
      .forEach(([pid]) => canZero.add(pid));
  }
  return canZero;
};

// const example = `
//   0 <-> 2
//   1 <-> 1
//   2 <-> 3, 4, 0
//   3 <-> 2, 4
//   4 <-> 2, 3, 6
//   5 <-> 6
//   6 <-> 4, 5
// `;
// console.log(groupZero(
//   new Map(
//     example
//     .trim()
//     .split('\n')
//     .map(s => program.tryParse(s.trim()))
//   )
// ).size);

console.log('contain zero:', groupZero(input).size);
