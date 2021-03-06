# rblb-utils 

> Common utils and shims used by RBLB projects

Basically, this is just my lazy way of adding a few choice shims that I use regularly in certain projects. You might want to look at [lodash](https://lodash.com) instead as it's better for public use ;)


## Install

```
$ yarn add rblb-utils
```

or

```
$ npm install --save rblb-utils
```

## Usage

```
require("rblb-utils"); // No need toassign to an object as it's all shims
```

## Included

* [es6-promise-peek](https://github.com/perchten/es6-promise-peek)


## Shims


### `Object.entries(Obj)`

```
Object.entries({"a": 1, "b": 2}) 
// => [["a", 1], ["b", 2]]
```

### `Object.prototype.oentries()`

```
{"a": 1, "b": 2}.oentries() 
// => [["a", 1], ["b", 2]]
```

### `Object.values(Obj)`

```
Object.values({"a": 1, "b": 2})
// => [1, 2]
```

### `Object.prototype.ovalues()`

```
{"a": 1, "b": 2}.ovalues() 
// => [1, 2]
```

### `Object.oreduce(Obj, fn)`

```
const source = {"a": 1, "b": 2};
Object.oreduce(source, (acc, k, v) => {
    acc[k] = v;
    if (v%2 == 0) {
      acc.evens = (acc.evens || 0 ) + 1;
    } else {
      acc.odds = (acc.odds || 0) + 1;
    }
    return acc;
  }, {"c": 3})
// {"a": 1, "b": 2, "c": 3, "odds": 1, "evens": 1} 
```

Initial value is optional:

```
const source = {"a": 1, "b": 2};
Object.oreduce(source, (acc, k, v) => {
    acc[k] = v;
    if (v%2 == 0) {
      acc.evens = (acc.evens || 0 ) + 1;
    } else {
      acc.odds = (acc.odds || 0) + 1;
    }
    return acc;
  })
// {"a": 1, "b": 2, "odds": 1, "evens": 1} 
```

### `Object.prototype.oreduce(fn)`

```
const source = {"a": 1, "b": 2};
source.oreduce((acc, k, v) => {
    acc[k] = v;
    if (v%2 == 0) {
      acc.evens = (acc.evens || 0 ) + 1;
    } else {
      acc.odds = (acc.odds || 0) + 1;
    }
    return acc;
  }, {"c": 3)
// {"a": 1, "b": 2, "odds": 1, "evens": 1, "c": 3} 
```


Initial value is optional:

```
const source = {"a": 1, "b": 2};
source.oreduce((acc, k, v) => {
    acc[k] = v;
    if (v%2 == 0) {
      acc.evens = (acc.evens || 0 ) + 1;
    } else {
      acc.odds = (acc.odds || 0) + 1;
    }
    return acc;
  })
// {"a": 1, "b": 2, "odds": 1, "evens": 1} 
```


### `Object.omap(Obj, fn)`

```
const source = {"a": 1, "b": 2};
Object.omap(source, (k, v) => (k==="a") ? v*2 : 0);
// {"a": 2, "b": 0}
```

### `Object.prototype.omap(fn)`

```
const source = {"a": 1, "b": 2};
source.omap((k, v) => (k==="a") ? v*2 : 0);
// {"a": 2, "b": 0}
```

### `Object.ofilter(Obj, fn)`

```
const source = {"a": 1, "b": 2, "c": 3};
Object.ofilter(source, (k, v) => k === "a" || v%2 ==0);
// {"a": 1, "b": 2}
```

### `Object.prototype.ofilter(fn)`

```
const source = {"a": 1, "b": 2, "c": 3};
source.ofilter((k, v) => k === "a" || v%2 ==0);
// {"a": 1, "b": 2}
```


### `Object.pickAndAssign(...sources)`

```
const source1 = {"a": "nope"};
const source2 = {"c": "nope"}
const source3 = {"a": "yes", "b": "also", "c": "nope"};
{"a": 1, "b": 2}.pickAndAssign(source1, source2, source3);
// {"a": "yes", "b": "also"}
```

Useful if you have an object containing default config and want to extract the values from multiple hierarchical config sources with many entries:

```
const defaults = {
    "a": 1,
    "b": undefined,
    "c": "xyz"
}

const configSourceA = {
    "a": 2
    ...
}
const configSourceB = {
    "a": 3,
    "b": "x"
    ...
}

defaults.pickAndAssign(configSourceA, configSourceB);
// => {"a": 3, "b": "x", "c": "xyz"}
```


### `Array.seqAsync(fn)`

Stands for "Sequential Async". It will run the async function on each value in the array in turn, waiting for the previous function to complete before stepping through to the next. If `fn` is not async then use `Array.forEach(fn)` or `Array.map(fn)` if you need the result.

The result returned by each function's promise is passed as a parameter to the next, so this is also effectively a reducer.

```
const fn = (x) => {
    return someAsyncFn(c)
        .then(console.log(x));
}
["a", "b", "c"].seqAsync(fn)
// => "a"
// => "b"
// => "c"
```

### `Array.toObjectKeys()`

```
["a", "b", "c"].toObjectKeys()
// => {"a": undefined, "b": undefined, "c": undefined}
```

Handy in conjunction with `pickAndAssign` for setting up the initial object and then pulling out the values from other objects. e.g. for extracting a subset of config from multiple hierarchical config sources:

```
const desiredConfig = ["a", "b", "c"]
const configSourceA = {
    "a": 1 
    ...   
}
const configSourceB = {
    "a": 2,
    "b" "x"
    ...
}
desiredConfig.toObjectKeys().pickAndAssign(configSourceA, configSourceB);
// => {"a": 2, "b": "x", "c": undefined}
```

## Testing

```
npm run mocha
```

## License

MIT © [Alastair Brayne]
