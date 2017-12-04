/* eslint-disable no-constant-condition */
const {Range} = require('immutable');
const {sum} = require('ramda');
const input = '361527';

// 37                       31
//     17  16  15  14  13
//     18   5   4   3  12
//     19   6   1   2  11
//     20   7   8   9  10
//     21  22  23  24  25  26
// 43                      49

const grid = function () {
  let coord = [-1, 0];
  return Range(1, Infinity, 2)
    .flatMap(function* (n) {
      coord[0]++;
      yield coord;

      if (n == 1) return;

      const side = n - 1;
      const sides = [
        [side - 1, () => coord[1]++],
        [side, () => coord[0]--],
        [side, () => coord[1]--],
        [side, () => coord[0]++],
      ];
      for (let [times, mutateCoord] of sides) {
        for (let i = 0; i < times; i++) {
          mutateCoord();
          yield coord;
        }
      }
    })
    .entrySeq()
    .map(([i, coord]) => ({n: i + 1, coord}));
};

const coordNeighbors = ([x, y]) => [
  [x - 1, y + 1], [x, y + 1], [x + 1, y + 1],
  [x - 1, y],                 [x + 1, y],
  [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
];

const serializeCoord = ([x, y]) => `${x}:${y}`;
const coordValues = new Map();

console.log('first greater than input:',
  grid()
    .map(({n, coord}) => {
      const neighborSum = sum(
        coordNeighbors(coord).map(nc => coordValues.get(serializeCoord(nc)) || 0)
      ) || 1;
      coordValues.set(serializeCoord(coord), neighborSum);

      return {n, coord, value: neighborSum};
    })
    .skipWhile(({value}) => value < input)
    .first()
);

