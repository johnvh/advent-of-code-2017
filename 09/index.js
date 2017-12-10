const input = require('fs').readFileSync('./input.txt', 'utf8');

const parser = function* (input) {
  let n = 0;
  let inGarbage = false;
  let inCancel = false;
  let garbageChars = '';
  for (let char of input) {
    if (inCancel) {
      inCancel = false;
      continue;
    }
    if (inGarbage && !/[>!]/.test(char)) {
      garbageChars += char;
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
        yield {event: 'garbageEnd', chars: garbageChars};
        garbageChars = '';
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
    .reduce((t, c) => t += c.val, 0);
};

const garbageChars = input => {
  return [...parser(input)]
    .filter(e => e.event === 'garbageEnd')
    .reduce((t, c) => t += c.chars.length, 0);
};

const assert = require('assert');
// assert.equal(score('{{{<>},{},{{}}}}'), 16);
// assert.equal(score('{{<!!}>},{<!!!>,>},{<!!>},{<!!>}}'), 9);
// assert.equal(score('{<{o"i!a,<{i<a>}'), 1);

// assert.equal(garbageChars('<>'), 0);
// assert.equal(garbageChars('<random characters>'), 17);
// assert.equal(garbageChars('<<<<>'), 3);
// assert.equal(garbageChars('<{!>}>'), 2);
// assert.equal(garbageChars('<!!>'), 0);
// assert.equal(garbageChars('<!!!>>'), 0);
// assert.equal(garbageChars('<<<<><{!>}>'), 5);

console.log('score:', score(input));
console.log('garbageChars:', garbageChars(input));

