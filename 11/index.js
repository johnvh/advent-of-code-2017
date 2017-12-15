const {cond, equals, reduce} = require('ramda')
const input = require('fs').readFileSync('./input.txt', 'utf8')
  .split(',')
  .map(s => s.trim());

const move = (dir, [x, y, z]) => cond([
  [equals('n'),  () => [x,     y + 1, z - 1]],
  [equals('ne'), () => [x + 1, y,     z - 1]],
  [equals('se'), () => [x + 1, y - 1, z    ]],
  [equals('s'),  () => [x,     y - 1, z + 1]],
  [equals('sw'), () => [x - 1, y,     z + 1]],
  [equals('nw'), () => [x - 1, y + 1, z    ]]
])(dir);

const distance = ([ax, ay, az], [bx, by, bz]) =>
  (Math.abs(ax - bx) + Math.abs(ay - by) + Math.abs(az - bz)) / 2;

const follow = (start, dirs) => reduce(
  (pos, dir) => move(dir, pos),
  start,
  dirs
);

const max = (start, dirs) => reduce(
  ({pos, max}, dir) => {
    const nextPos = move(dir, pos);
    const dist = distance(start, nextPos);
    return {pos: nextPos, max: Math.max(max, dist)};
  },
  {pos: start, max: 0},
  dirs
);

const origin = () => [0, 0, 0];

// console.log(distance(
//   [0, 0, 0],
//   follow([0, 0, 0], 'se,sw,se,sw,sw'.split(','))
// ));

console.log('distance:', distance(
  origin(),
  follow(origin(), input)
));

console.log('furthest:', max(origin(), input).max);
