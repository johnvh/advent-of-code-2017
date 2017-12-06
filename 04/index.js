const input = require('fs').readFileSync('./input.txt', 'utf8')
  .split('\n')
  .map(s => s.trim());

const isValidDupes = pp => {
  const words = pp.split(' ');
  return words.length === new Set(words).size;
};

const hasAnagram = phrase => {
  const words = phrase.split(' ');
  return words.length !== new Set(words.map(w => w.split('').sort().join(''))).size;
};
const isValidViaAnagram = phrase => !hasAnagram(phrase);

// const assert = require('assert');
// assert.equal(isValidViaAnagram('abcde fghij'), true);
// assert.equal(isValidViaAnagram('abcde xyz ecdab'), false);
// assert.equal(isValidViaAnagram('a ab abc abd abf abj'), true);
// assert.equal(isValidViaAnagram('iiii oiii ooii oooi oooo'), true);
// assert.equal(isValidViaAnagram('oiii ioii iioi iiio'), false);
// console.log('✅');

console.log('num valid (no dupe words):', input.filter(isValidDupes).length);
console.log('num valid (no anagram):', input.filter(isValidViaAnagram).length);
