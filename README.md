# dynamic-serializer
A class to help you snapshot json trees that contain random values

## Installation
`yarn add dynamic-serializer`

## What's it do
Jest snapshot testing is great, but it doesn't work if one of your values is random.
With this package, you can replace random values with deterministic ones.

## How's it different from using Jest's built-in snapshotSerializers?
Jests's built in snapshotSerializers config stops short of being useful.
You can't tell it which fields you'd like to replace.
It doesn't hold state to ensure that the same random value turns into the same static value.

## Usage

### call this on your JSON before taking a snapshot

Example:

```js
// in foo.test.js
import DynamicSerializer from 'dynamic-serializer';

const fullPaths = ['primaryKey', 'wholeArray', 'singleValue.levelOne.arr.3']
test('makes simple dynamic fields deterministic', () => {
  const dynamicSerializer = new DynamicSerializer();
  const results = {
    staticProp: 'Hi there',
    primaryKey: Math.random(),
    wholeArray: [Math.random(), Math.random()],
    singleValue: {
      levelOne: {
        arr: ['badger', 'badger', 'mushroom', 'snake' + Math.random()]
      }
    }
  };
  const moreResults = {
    foreignKey: results.primaryKey()
  };
  dynamicSerializer.toStatic(results, fullPaths);
  dynamicSerializer.toStatic(moreResults, ['foreignKey']);
 
  expect(results).toMatchSnapshot();
  expect(moreResults).toMatchSnapshot();
  expect(results.primaryKey).toBe(moreResults.foreignKey);
});
```

## API

```
new DynamicSerializer();
```

Creates a new instance suitable for a single test.
 
## Methods

```
dynamicSerializer.toStatic(snapshot, fullPaths)
```

Options:
- `snapshot`: the JSON tree you wish to mutate
- `fullPaths`: an array of dot-separated paths. 
If the final destination of the path is an array, all values will be replaced.
If you only want to replace one part of an array, it needs to end in a number.


## License

MIT
