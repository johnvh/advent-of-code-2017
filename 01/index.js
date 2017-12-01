const assert = require('assert');
const toArr = digitStr => digitStr.split('').map(d => parseInt(d, 10));
const input = toArr(require('fs').readFileSync('./input.txt', 'utf8'));

const compareToAdjacent = (d, i, arr) => {
  const compareTo = i === arr.length - 1 ? arr[0] : arr[i + 1];
  return compareTo === d;
};

const compareToHalfway = (d, i, arr) => {
  let compareToIdx = i + (arr.length / 2);
  if (compareToIdx >= arr.length) {
    compareToIdx -= arr.length;
  }
  return arr[compareToIdx] === d;
};

const captcha = (filter, digits) => digits
  .filter(filter)
  .reduce((sum, d) => sum + d, 0);

// assert.equal(captcha(compareToAdjacent, toArr('1122')), 3);
// assert.equal(captcha(compareToAdjacent, toArr('1111')), 4);
// assert.equal(captcha(compareToAdjacent, toArr('1234')), 0);
// assert.equal(captcha(compareToAdjacent, toArr('91212129')), 9);

// assert.equal(captcha(compareToHalfway, toArr('1212')), 6);
// assert.equal(captcha(compareToHalfway, toArr('1221')), 0);
// assert.equal(captcha(compareToHalfway, toArr('123425')), 4);
// assert.equal(captcha(compareToHalfway, toArr('123123')), 12);
// assert.equal(captcha(compareToHalfway, toArr('12131415')), 4);

console.log('sum, adjacent:', captcha(compareToAdjacent, input));
console.log('sum, halfway:', captcha(compareToHalfway, input));
