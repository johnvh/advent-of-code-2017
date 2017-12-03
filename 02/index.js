const assert = require('assert');
const combos = require('combinations-generator');
const {split, map, reduce, pipe, tap, sum, addIndex} = require('ramda');

const min = arr => Math.min(...arr);
const max = arr => Math.max(...arr);

const input = require('fs').readFileSync('./input.txt', 'utf8')
  .split('\n')
  .map(split('\t'))
  .map(map(n => parseInt(n, 10)));

const checksumDifference = pipe(
  map(row => max(row) - min(row)),
  sum
);

const checksumDiv = pipe(
  map(row => {
    for (let pair of combos(row, 2)) {
      const r = max(pair) / min(pair);
      if (r % 1 === 0) return r;
    }
    throw new Error('💥');
  }),
  sum
);

console.log('checksum (difference):', checksumDifference(input));
console.log('checksum (divisible):', checksumDiv(input));
