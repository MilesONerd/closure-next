module.exports = function pLimit(concurrency) {
  const queue = [];
  let activeCount = 0;

  const next = () => {
    activeCount--;
    if (queue.length > 0) {
      queue.shift()();
    }
  };

  const run = async (fn, ...args) => {
    activeCount++;
    const result = await fn(...args);
    next();
    return result;
  };

  const enqueue = (fn, ...args) => {
    return new Promise((resolve, reject) => {
      const task = () => run(fn, ...args).then(resolve, reject);
      if (activeCount < concurrency) {
        task();
      } else {
        queue.push(task);
      }
    });
  };

  return enqueue;
};
