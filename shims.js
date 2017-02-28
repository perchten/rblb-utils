'use strict';

const reduce = Function.bind.call(Function.call, Array.prototype.reduce);
const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
const concat = Function.bind.call(Function.call, Array.prototype.concat);
const keys = Object.keys;

if (!Object.prototype.values) {
  Object.defineProperty(Object.prototype, 'values', {
    value: function() {
      return reduce(keys(this), (v, k) => concat(v, typeof k === 'string' && isEnumerable(this, k) ? [this[k]] : []), []);
    }
  });
}
if (!Object.prototype.entries) {
  Object.defineProperty(Object.prototype, 'entries', {
    value: function() {
      return reduce(keys(this), (e, k) => concat(e, typeof k === 'string' && isEnumerable(this, k) ? [[k, this[k]]] : []), []);
    }
  });
}


// Chain promises. Sequentially map the function to the array. `fn` must always return a promise
if (!Array.prototype.seqAsync) {
  Object.defineProperty(Array.prototype, 'seqAsync', {
    value: function(callback) {
      if (this === null) {
        throw new TypeError('Array.prototype.seqAsync called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }

      return this.reduce((previous, item) => {
        return previous.then(callback(item));
      }, Promise.resolve());
    }
  });
}

// Create an object with the array entries set as the keys
if (!Array.prototype.toObjectKeys) {
  Object.defineProperty(Array.prototype, 'toObjectKeys', {
    value: function() {
      if (this === null) {
        throw new TypeError('Array.prototype.toObjectKeys called on null or undefined');
      }

      return this.reduce((obj, key) => {
        if (typeof key != 'string')
          throw new TypeError(`Array entry is not a string and cannot be used for an object key: ${key}`);

        obj[key] = undefined;
        return obj;
      }, {});
    }
  });
}


// Create a tap on Promise objects
if (!Promise.prototype.peek) {
  Object.defineProperty(Promise.prototype, 'peek', {
    value: function(fn) {
      if (this === null) {
        throw new TypeError('Promise.prototype.peek called on null or undefined');
      }
      if (typeof fn !== 'function') {
        throw new TypeError(fn + ' is not a function');
      }

      return this.then(val => {
        fn(val);
        return val;
      });
    }
  });
}

// Create new object with only the keys in the canon, but allowing subsequent sources to override those keys.
if (!Object.prototype.pickAndAssign) {
  Object.defineProperty(Object.prototype, 'pickAndAssign', {
    value: function(...sources) {
      if (this === null) {
        throw new TypeError('Object.prototype.pickAndAssign called on null or undefined');
      }
      sources.forEach(source => {
        if (typeof source !== 'object') {
          throw new TypeError(`Source '${source}' is not a function`);
        }
      });

      const keys = Object.keys(this);
      sources = sources.map(s => {
        return Object.keys(s)
          .filter(k => keys.includes(k))
          .reduce((obj, k) => { obj[k] = s[k]; return obj}, {});
      });
      return Object.assign({}, this, ...sources);
    }
  });
}