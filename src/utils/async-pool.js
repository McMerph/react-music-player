// Based on https://github.com/rxaviers/async-pool

async function asyncPool(concurrency, argsArray, getPromiseFn) {
  const result = [];
  const executing = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const argument of argsArray) {
    const promise = getPromiseFn(argument);
    result.push(promise);
    const e = promise.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    if (executing.length >= concurrency) {
      // eslint-disable-next-line no-await-in-loop
      await Promise.race(executing);
    }
  }
  return Promise.all(result);
}

export default asyncPool;
