const input = require('fs').readFileSync('./input.txt', 'utf8')
  .split('\n')
  .map(s => s.trim());

const isValid = pp => {
  const words = pp.split(' ');
  return words.length === new Set(words).size;
};

console.log('num valid:', input.filter(isValid).length);
