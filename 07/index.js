const P = require('parsimmon');
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
const tower = require('fs').readFileSync('./input.txt', 'utf8')
  .trim()
  .split('\n')
  .map(parser.tryParse.bind(parser));

// console.log(parser.parse('rxivjo (206) -> mewof, hrncqs, qgfstpq'));
// console.log(parser.parse('rxivjo (206)'));
// console.log(tower.slice(0, 2));

const root = tower => {
  let curr = tower[0];

  while (true) {
    const parent = tower.find(node => node.children.includes(curr.name));
    if (!parent) {
      return curr;
    }
    curr = parent;
  }
};

console.log('root:', root(tower).name);
