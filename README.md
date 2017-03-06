# dynamic-serializer
A class to help you snapshot json trees that contain dynamic values like UIDs

## Installation
`yarn add dynamic-serializer`

## What's it do
Jest snapshot testing is great, but it doesn't work if one of your values is non-deterministic.
With this package, you can replace those values with deterministic ones.

## How's it different from using Jest's built-in snapshotSerializers?
Jests' built-in snapshotSerializers config stops short of being useful (for this case).
You can't tell it which fields you'd like to replace.
Even if you could, it doesn't hold state to ensure that the same dynamic value turns into the same static value.

## Usage

### Call it on your JSON tree before taking a snapshot

Example:

```js
// in foo.test.js
import DynamicSerializer from 'dynamic-serializer';

const fullPaths = ['primaryKey', 'wholeArray', 'singleValue.levelOne.arr.3'];

test('makes simple dynamic fields deterministic', () => {
  const dynamicSerializer = new DynamicSerializer();
  const userId = Math.random();
  const results = {
    staticProp: 'Hi there',
    primaryKey: userId,
    wholeArray: [Math.random(), Math.random()],
    singleValue: {
      levelOne: {
        arr: ['badger', 'badger', 'mushroom', 'snake' + Math.random()]
      }
    }
  };
  const moreResults = {
    foreignKey: userId
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
const dynamicSerializer = new DynamicSerializer();
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
If the JSON structure is an array, start it off with a number, too.
For more use cases, see the tests.

## FAQ

Q: Why do you mutate my JSON tree? I heard good functional programming never mutates...

A: Speed, space, and forcing good habits. 
Mutating is faster and causes less GC.
It also forces you to call it just before your snapshot.
If you want to do something fancy with the original _after_ calling this, you're doing it wrong. 

## License

MIT
