const input = require('fs').readFileSync('./input.txt', 'utf8')
  .split('\t')
  .map(n => parseInt(n, 10));

const idxFullest = banks => banks.reduce((fullestIdx, currSize, i, banks) => {
  return currSize > (banks[fullestIdx] || 0) ? i : fullestIdx;
}, -1);

const balance = banks => {
  banks = banks.concat();
  const configurations = new Set();
  let balancedAt;
  let cycleConf;
  let step = 0;
  while (true) {
    const nextIdx = n => (n + 1) % banks.length;
    const fullestIdx = idxFullest(banks);
    let blocks = banks[fullestIdx];
    let idx = nextIdx(fullestIdx);
    banks[fullestIdx] = 0;

    while (blocks > 0) {
      banks[idx]++;
      blocks--;
      idx = nextIdx(idx);
    }

    step++;
    const conf = banks.reduce((accum, curr) => accum.concat(curr.toString()), '');
    if (conf === cycleConf) {
      console.log('cycle detected, steps:', step - balancedAt);
      return;
    }
    if (configurations.has(conf) && !cycleConf) {
      console.log('steps to balance:', step);
      balancedAt = step;
      cycleConf = conf;
    }
    configurations.add(conf);
  }
};

balance(input);
