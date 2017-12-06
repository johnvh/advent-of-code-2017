/* eslint-disable no-constant-condition */

const input = require('fs').readFileSync('./input.txt', 'utf8').split('\n').map(n => parseInt(n, 10));
const printProgress = process.argv.includes('--print-progress');

const processIns = newValue => input => {
  input = input.concat();
  let pos = 0;
  let i = 0;
  let nextPos;
  while (true) {
    const offset = input[pos];
    i++;
    nextPos = pos + offset;

    if (printProgress && i % 20 === 0) {
      console.log({i, offset, nextPos, total: input.length});
    }
    if (nextPos >= input.length) {
      return i;
    }

    input[pos] = newValue(offset);
    pos = nextPos;
  }
};
const processSimple = processIns(n => ++n);
const processComplex = processIns(n => n >= 3 ? --n : ++n);

// const assert = require('assert');
// assert.equal(processSimple([0, 3, 0, 1, -3]), 5);

console.log('steps (simple):', processSimple(input));
console.log('steps (complex):', processComplex(input));
