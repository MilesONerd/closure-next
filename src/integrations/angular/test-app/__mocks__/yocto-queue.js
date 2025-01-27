module.exports = class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  get size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
};
