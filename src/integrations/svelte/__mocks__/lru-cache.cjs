const LRUCache = function(options = {}) {
  if (!(this instanceof LRUCache)) {
    return new LRUCache(options);
  }
  this.cache = new Map();
  this.max = options.max || 500;
};

LRUCache.prototype.get = function(key) { return this.cache.get(key); };
LRUCache.prototype.set = function(key, value) {
  if (this.cache.size >= this.max) {
    const firstKey = this.cache.keys().next().value;
    this.cache.delete(firstKey);
  }
  this.cache.set(key, value);
  return this;
};
LRUCache.prototype.has = function(key) { return this.cache.has(key); };
LRUCache.prototype.delete = function(key) { return this.cache.delete(key); };
LRUCache.prototype.clear = function() { this.cache.clear(); };

module.exports = { LRUCache };
