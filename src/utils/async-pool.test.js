import asyncPool from './async-pool';

test('asyncPool() works', async () => {
  const results = [];
  const getPromiseFn = (i) =>
    new Promise((resolve) =>
      setTimeout(() => {
        results.push(i);
        resolve();
      }, i)
    );
  await asyncPool(2, [100, 500, 300, 200], getPromiseFn);
  expect(results).toStrictEqual([100, 300, 500, 200]);
});
