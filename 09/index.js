const EventEmitter = require('events');
const input = require('fs').readFileSync('./input.txt', 'utf8');

const parser = function* (input) {
  let n = 0;
  let inGarbage = false;
  let inCancel = false;
  for (let char of input) {
    if (inCancel) {
      inCancel = false;
      continue;
    }
    switch (char) {
      case '{':
        if (inGarbage) continue;
        n++;
        yield {event: 'groupStart', val: n};
      break;
      case '}':
        if (inGarbage) continue;
        yield {event: 'groupEnd', val: n};
        n--;
      break;
      case '<':
        inGarbage = true;
      break;
      case '>':
        inGarbage = false;
      break;
      case '!':
        if (inGarbage) {
          inCancel = true;
        }
      break;
    }
  }
};

const score = input => {
  return [...parser(input)]
    .filter(e => e.event === 'groupEnd')
    .map(e => e.val)
    .reduce((t, c) => t += c, 0)
};

// const assert = require('assert');
// assert.equal(score('{{{<>},{},{{}}}}'), 16);
// assert.equal(score('{{<!!}>},{<!!!>,>},{<!!>},{<!!>}}'), 9);
// assert.equal(score('{<{o"i!a,<{i<a>}'), 1);

console.log('score:', score(input));

