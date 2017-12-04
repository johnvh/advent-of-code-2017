const assert = require('assert');
const {range} = require('ramda');
const input = '361527';

//37                      31
//    17  16  15  14  13
//    18   5   4   3  12
//    19   6   1   2  11
//    20   7   8   9  10
//    21  22  23  24  25  26

const containedInSize = n => {
  let i = 1;
  while ((i ** 2) <= n) i += 2;
  return i;
};

const cornersForSize = n => range(0, 4).map(i => n ** 2 - (n - 1) * i).reverse();
const middlesForSize = n => {
  const corners = cornersForSize(n);
  const toMiddle = (corners[1] - corners[0]) / 2;
  return corners.reverse().map(i => i - toMiddle);
};

const distanceToMiddle = n => {
  const gridSize = containedInSize(n);
  const middles = middlesForSize(gridSize);
  const toMiddle = Math.min(...middles.map(m => Math.abs(n - m)));
  // console.log('grid size:', gridSize);
  // console.log('middles:', middles);
  // console.log('to middle:', toMiddle);
  return toMiddle + Math.floor(gridSize / 2);
};

assert.equal(distanceToMiddle(12), 3);
assert.equal(distanceToMiddle(23), 2);
assert.equal(distanceToMiddle(1024), 31);

console.log('steps to access port:', distanceToMiddle(input));
