const P = require('parsimmon');
const {Range} = require('immutable');
const input = require('fs').readFileSync('./input.txt', 'utf8');
const parseInt = n => Number.parseInt(n, 10);

const example = `
0: 3
1: 2
4: 4
6: 4`.trim();

const layer = P.seqObj(
  ['depth', P.digits.map(parseInt)],
  P.string(':').wrap(P.optWhitespace, P.optWhitespace),
  ['range', P.digits.map(parseInt)],
);
const layers = layer.sepBy(P.string('\n'));

// console.log(layer.parse('12: 13'));
// console.log(layers.parse('12: 13\n2: 5'));

const firewall = layers.tryParse(input);

const caught = (start, {depth, range}) => {
  const multiple = (range - 1) * 2;
  const d = depth + start;
  const m1 = d % multiple === 0 ? d : (Math.floor(d / multiple) + 1) * multiple;
  return m1 === depth + start;
};
const severity = fw => {
  return fw.filter(layer => caught(0, layer))
    .map(({depth, range}) => depth * range)
    .reduce((t, curr) => t + curr, 0);
};

// console.log(caught(0, {depth: 4, range: 4}));
// console.log(severity(layers.tryParse(example)));
console.log('severity:', severity(firewall));

const calcDelay = fw => Range()
  .map(n => ({
    n,
    caught: fw.find(layer => caught(n, layer)) || false
  }))
  .skipUntil(({caught}) => caught === false)
  .take(1)
  .toArray()[0];

// console.log('delay:', calcDelay(layers.tryParse(example)));
console.log('delay:', calcDelay(firewall));
