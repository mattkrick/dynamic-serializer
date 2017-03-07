import DynamicSerializer from '../src/index';

test('handles top-level paths', () => {
  const paths = ['top'];
  const snapshot = {
    top: 'rand'
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('handles deep-nested paths', () => {
  const paths = ['top.two.three'];
  const snapshot = {
    top: {
      two: {
        three: 'rand'
      }
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('handles nested arrays', () => {
  const paths = ['top.two.three'];
  const snapshot = {
    top: {
      two: {
        three: ['rand1', 'rand2']
      }
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('handles single value in nested arrays', () => {
  const paths = ['top.two.three.1'];
  const snapshot = {
    top: {
      two: {
        three: ['static', 'rand2']
      }
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('reuses pre-established vars for other snapshots', () => {
  const paths = ['top.two.three.1'];
  const snapshot = {
    top: {
      two: {
        three: ['static', 'rand2']
      }
    }
  };

  const paths2 = ['foreignKey'];
  const snapshot2 = {
    foreignKey: snapshot.top.two.three[1]
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  dynamicSerializer.toStatic(snapshot2, paths2);
  expect(snapshot).toMatchSnapshot();
  expect(snapshot2).toMatchSnapshot();
  expect(snapshot.top.two.three[1]).toBe(snapshot2.foreignKey);
});

test('does not replace null or undefined', () => {
  const paths = ['top.two.three.1', 'top.two.three.0'];
  const snapshot = {
    top: {
      two: {
        three: [null, undefined]
      }
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('does not replace null or undefined or missing', () => {
  const paths = ['top.two.three.1', 'top.two.three.0', 'top.two.4', 'top.two.5'];
  const snapshot = {
    top: {
      two: {
        three: [null, undefined]
      },
      4: undefined
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('goes deep after a single array point', () => {
  const paths = ['top.a', 'top.two.three.1.a'];
  const snapshot = {
    top: {
      a: 'rand',
      two: {
        three: [
          null,
          {
            a: 'rand'
          }
        ]
      }
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('handles an array in an array', () => {
  const paths = ['top.two.three.1.2'];
  const snapshot = {
    top: {
      two: {
        three: [null, ['static', 'static', 'rand']]
      }
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('handles a top level array', () => {
  const paths = ['1.0'];
  const snapshot = ['static', [
    'rand'
  ]];
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('handles final-path empty values', () => {
  const paths = ['a.b', 'a.c'];
  const snapshot = {
    a: {
      b: '',
      c: [null]
    }
  };
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});

test('handles an array of objects', () => {
  const paths = ['a.b', 'a.c'];
  const snapshot = [
    {
      a: {
        b: 'rand',
      }
    }
  ];
  const dynamicSerializer = new DynamicSerializer();
  dynamicSerializer.toStatic(snapshot, paths);
  expect(snapshot).toMatchSnapshot();
});
