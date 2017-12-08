const {pipe, prop, equals, cond, T, max} = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(s => {
    const [
      reg, op, amount, _, condReg, cond, condAmount
    ] = s.split(' ');
    return {reg, op, amount: parseInt(amount, 10), condReg, cond, condAmount: parseInt(condAmount, 10)};
  });

const registers = new Map(input.map(r => [r.reg, 0]));

const highestValue = registers =>
  [...registers.entries()]
    .reduce(
      (largest, curr) => curr[1] > largest[1] ? curr : largest,
      ['', Number.NEGATIVE_INFINITY]
    );

const applyIns = (registers, instructions) => {
  let highest = Number.NEGATIVE_INFINITY;
  instructions.forEach(ins => {
    const condReg = registers.get(ins.condReg);
    const condAmount = ins.condAmount;
    const condMet = cond([
      [equals('>'), () => condReg > condAmount],
      [equals('>='), () => condReg >= condAmount],
      [equals('<'), () => condReg < condAmount],
      [equals('<='), () => condReg <= condAmount],
      [equals('=='), () => condReg == condAmount],
      [equals('!='), () => condReg != condAmount],
      [T, cond => {
        throw new Error(`💥  unknown cond "${cond}"`);
      }]
    ])(ins.cond);

    if (condMet) {
      const val = registers.get(ins.reg);
      registers.set(
        ins.reg,
        ins.op === 'inc' ? val + ins.amount : val - ins.amount
      );
    }

    highest = max(highest, highestValue(registers)[1]);
  });
  return highest;
};
const highestValueDuring = applyIns(registers, input);

// console.log(input.slice(0, 2));
// console.log(registers);

console.log('largest register (end):', highestValue(registers));
console.log('largest register (during):', highestValueDuring);

