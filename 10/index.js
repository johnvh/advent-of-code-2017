const assert = require('assert');
const {range, cond, pipe, T, take} = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf8')
  .trim()
  .split(',')
  .map(n => parseInt(n.trim(), 10));

const arrayRotate = (amount, arr) => {
    amount = amount % arr.length;
    amount = amount < 0 ? arr.length + amount : amount;
    if(amount === 0){
        return arr;
    }
    return arr.slice(amount).concat(arr.slice(0, amount - arr.length));
};

// [0, 1, 2, 3]
// [(0, 1), 2, 3]
// [0, (1, 2), 3]
// [0, 1, (2, 3)]
// [0), 1, 2, (3]
const twist = (list, pos, len) => {
  const a = arrayRotate(pos, list);
  return arrayRotate(
    -pos,
    a.slice(0, len).reverse().concat(a.slice(len))
  );
};
// assert.deepEqual(twist([0, 1, 2, 3], 0, 0), [0, 1, 2, 3]);
// assert.deepEqual(twist([0, 1, 2, 3], 0, 1), [0, 1, 2, 3]);
// assert.deepEqual(twist([0, 1, 2, 3], 2, 2), [0, 1, 3, 2]);
// assert.deepEqual(twist([0, 1, 2, 3], 3, 3), [0, 3, 2, 1]);
// console.log('✅  twist');

const knot = (list, input) => {
  let pos = 0;
  let skipSize = 0;
  list = list.concat();
  input.forEach(len => {
    list = twist(list, pos, len);
    pos = (pos + len + skipSize) % list.length;
    skipSize++;
  });
  return list;
};
// assert.deepEqual(knot(range(0, 5), [3, 4, 1, 5]), [3, 4, 2, 1, 0]);
// console.log('✅  knot');

console.log('product:',
  pipe(
    take(2),
    ([a, b]) => a * b
  )(knot(range(0, 256), input))
);
