const P = require('parsimmon');
const {pipe, assoc, sum} = require('ramda');
const toInt = n => parseInt(n, 10);
const parser = P.seqObj(
  ['name', P.letters],
  P.optWhitespace,
  ['weight', P.digits.map(toInt).wrap(P.string('('), P.string(')'))],
  P.string('->').wrap(P.optWhitespace, P.optWhitespace).or(P.all),
  ['children',
    P.letters.trim(P.optWhitespace).sepBy(P.string(','))
      .map(arr => arr.filter(s => s))
  ]
);
// [{name:string, weight:number, children:string[]}]
const tower = new Map(
  require('fs').readFileSync('./input.txt', 'utf8')
    .trim()
    .split('\n')
    .map(pipe(
      parser.tryParse.bind(parser),
      t => [t.name, t]
    ))
);

// console.log(parser.parse('rxivjo (206) -> mewof, hrncqs, qgfstpq'));
// console.log(parser.parse('rxivjo (206)'));
// console.log([...tower.values()].slice(0, 2));

const parentNode = (tower, name) => [...tower.values()]
  .find(node => node.children.includes(name));
const root = tower => {
  let [curr] = tower.values();

  while (true) {
    // const parent = [...tower.values()].find(node => node.children.includes(curr.name));
    const parent = parentNode(tower, curr.name);
    if (!parent) {
      return curr;
    }
    curr = parent;
  }
};

console.log('root:', root(tower).name);
console.log('='.repeat(80));

const nodeWithFullChildren = (tower, name) => {
  const node = pipe(
    name => tower.get(name),
    node => assoc(
      'children',
      node.children.map(name => tower.get(name)),
      node
    )
  )(name);
  return node;
};
const nodeWeight = (tower, name) => {
  const node = pipe(
    name => tower.get(name),
    node => assoc(
      'children',
      node.children.map(name => nodeWeight(tower, name)),
      node
    )
  )(name);

  return sum([
    node.weight,
    ...node.children
  ]);
};

// cheating... 😎

console.log(pipe(
  () => nodeWithFullChildren(tower, 'gynfwly'),
  node => assoc(
    'children',
    node.children.map(child => assoc(
      'fullWeight',
      nodeWeight(tower, child.name),
      child
    )),
    node
  )
)());

console.log(pipe(
  () => nodeWithFullChildren(tower, 'jjjks'),
  node => assoc(
    'children',
    node.children.map(child => assoc(
      'fullWeight',
      nodeWeight(tower, child.name),
      child
    )),
    node
  )
)());

console.log(pipe(
  () => nodeWithFullChildren(tower, 'gtervu'),
  node => assoc(
    'children',
    node.children.map(child => assoc(
      'fullWeight',
      nodeWeight(tower, child.name),
      child
    )),
    node
  )
)());

