const assert = require('assert');
const {range, cond, pipe, T, take, prop, splitEvery, map, reduce} = require('ramda');
const input = require('fs').readFileSync('./input.txt', 'utf8').trim();

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
// assert.deepEqual(twist([0, 1, 2, 3], 0, 2), [1, 0, 2, 3]);
// assert.deepEqual(twist([0, 1, 2, 3], 3, 3), [0, 3, 2, 1]);
// console.log('✅  twist');

const knot1 = (list, input, pos=0, skipSize=0) => {
  list = list.concat();
  input.forEach(len => {
    list = twist(list, pos, len);
    pos = (pos + len + skipSize) % list.length;
    skipSize++;
  });
  return {list, pos, skipSize};
};
// assert.deepEqual(knot(range(0, 5), [3, 4, 1, 5]), [3, 4, 2, 1, 0]);
// console.log('✅  knot');

console.log('product:',
  pipe(
    () => knot1(
      range(0, 256),
      input.split(',').map(n => parseInt(n.trim(), 10))
    ),
    prop('list'),
    take(2),
    ([a, b]) => a * b
  )()
);

const knotHash = (list, input) => {
  const lengths = Array.from(new Buffer(input, 'ascii'))
    .concat([17, 31, 73, 47, 23]);
  let l = list;
  let pos = 0;
  let skipSize = 0;

  range(0, 64).forEach(() => {
    const r = knot1(l, lengths, pos, skipSize);
    l = r.list;
    pos = r.pos;
    skipSize = r.skipSize;
  });

  const blocks = pipe(
    splitEvery(16),
    map(b => b.reduce((total, n) => total ^ n)),
    map(n => n.toString(16).padStart(2, '0'))
  )(l);
  return blocks.join('');
};
// assert.equal(knotHash(range(0, 256), ''), 'a2582a3a0e66e6e86e3812dcb672a272');
// assert.equal(knotHash(range(0, 256), '1,2,3'), '3efbe78a8d82f29979031a4aa0b16a9d');
// console.log('✅  hash');

console.log('input hash:', knotHash(range(0, 256), input));
