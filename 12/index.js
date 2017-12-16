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

const groupN = (n, input) => {
  input = new Map([...input.entries()]);
  const canN = new Set([n]);

  for (let pid of canN.values()) {
    [...input.entries()]
      .filter(([newPid, outputs]) => outputs.includes(pid))
      .forEach(([pid]) => canN.add(pid));
  }
  return canN;
};

const allGroups = input => {
  // [{pid:number, group:Set}]
  const all = [...input.keys()]
    .map(pid => ({pid, group: groupN(pid, input)}));
  const groups = [];

  all.forEach(({pid, group}) => {
    let inGroups = false;
    groups.forEach(g => {
      if (g.group.has(pid)) {
        g.group = new Set([...g.group.values(), ...group.values()])
        inGroups = true;
      }
    })
    if (!inGroups) {
      groups.push({pid, group});
    }
  });
  return groups;
};

console.log('contain zero:', groupN(0, input).size);
console.log('num groups:', allGroups(input).length);

// const example = new Map(`
//     0 <-> 2
//     1 <-> 1
//     2 <-> 3, 4, 0
//     3 <-> 2, 4
//     4 <-> 2, 3, 6
//     5 <-> 6
//     6 <-> 4, 5
//   `
//     .trim()
//     .split('\n')
//     .map(s => program.tryParse(s.trim()))
// );
// console.log(groupN(0, example));
//
// console.log('0', groupN(0, example));
// console.log('1', groupN(1, example));
// console.log('2', groupN(2, example));
// console.log('3', groupN(3, example));
// console.log(allGroups(example).length);
