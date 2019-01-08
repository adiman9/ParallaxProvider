import ParallaxProvider from '../src';

let events = {};
beforeEach(() => {
  events = {};
  global.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
  });
});

test('it correctly adds one module to modules array', () => {
  const p = new ParallaxProvider([{}]);
  expect(p.modules.length).toBe(1);
});

test('it correctly adds two module to modules array', () => {
  const p = new ParallaxProvider([{}, {}]);
  expect(p.modules.length).toBe(2);
});

test('calls window.addEventListener() for scroll event', () => {
  global.addEventListener = jest.fn();

  const p = new ParallaxProvider([{}, {}]);

  expect(global.addEventListener).toHaveBeenCalledWith(
    'scroll',
    expect.any(Function),
  );
});

describe('scroll events with multiple sections', () => {
  let sectionOneCtrl = jest.fn();
  let sectionTwoCtrl = jest.fn();
  let sectionOneDur = 500;
  let sectionTwoDur = 800;

  beforeEach(() => {
    const p = new ParallaxProvider([
      {
        mountPoint: 0,
        duration: sectionOneDur,
        controller: sectionOneCtrl,
      },
      {
        mountPoint: 0,
        duration: sectionTwoDur,
        controller: sectionTwoCtrl,
      },
    ]);
  });

  test('it calls the controller on scroll', () => {
    events.scroll();

    expect(sectionOneCtrl).toHaveBeenCalled();
  });

  test('correct offset when scroll is inside the section', () => {
    global.pageYOffset = 10;

    events.scroll();

    expect(sectionOneCtrl).toHaveBeenCalledWith(
      global.pageYOffset,
      sectionOneDur,
    );
  });

  test('correct offset after section', () => {
    global.pageYOffset = 1000;

    events.scroll();

    expect(sectionOneCtrl).toHaveBeenCalledWith(
      global.pageYOffset,
      sectionOneDur,
    );
  });

  test('correct offset when before section two', () => {
    global.pageYOffset = 10;

    events.scroll();

    expect(sectionTwoCtrl).toHaveBeenCalledWith(
      global.pageYOffset - sectionOneDur,
      sectionTwoDur,
    );
  });

  test('correct offset during section two', () => {
    global.pageYOffset = 550;

    events.scroll();

    expect(sectionTwoCtrl).toHaveBeenCalledWith(
      global.pageYOffset - sectionOneDur,
      sectionTwoDur,
    );
  });

  test('correct offset after section two', () => {
    global.pageYOffset = 5000;

    events.scroll();

    expect(sectionTwoCtrl).toHaveBeenCalledWith(
      global.pageYOffset - sectionOneDur,
      sectionTwoDur,
    );
  });
});

test('it to call the duration function', () => {
  let durationFn = jest.fn();

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: durationFn,
      controller: () => {},
    },
  ]);

  expect(durationFn).toBeCalled();
});

test('it to use the value from the duration function', () => {
  let duration = 430;
  let durationFn = jest.fn(() => duration);
  let sectionCtrl = jest.fn();

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: durationFn,
      controller: sectionCtrl,
    },
  ]);
  global.pageYOffset = 0;

  events.scroll();

  expect(sectionCtrl).toBeCalledWith(global.pageYOffset, duration);
});

test('it should handle negative mount point', () => {
  let sectionCtrl = jest.fn();
  let sectionDur = 800;
  let mountPoint = -400;

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: 500,
      controller: () => {},
    },
    {
      mountPoint: 0,
      duration: 800,
      controller: () => {},
    },
    {
      mountPoint: mountPoint,
      duration: sectionDur,
      controller: sectionCtrl,
    },
  ]);

  global.pageYOffset = 850;

  events.scroll();

  expect(sectionCtrl).toBeCalledWith(
    global.pageYOffset - 1300 - mountPoint,
    sectionDur,
  );
});

test('it should handle absolute mounting', () => {
  let sectionCtrl = jest.fn();
  let sectionDur = 800;
  let mountPoint = 400;

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: 500,
      controller: () => {},
    },
    {
      mountPoint: 0,
      duration: 800,
      controller: () => {},
    },
    {
      mountPoint: mountPoint,
      mountType: 'absolute',
      duration: sectionDur,
      controller: sectionCtrl,
    },
  ]);

  global.pageYOffset = 950;

  events.scroll();

  expect(sectionCtrl).toBeCalledWith(
    global.pageYOffset - mountPoint,
    sectionDur,
  );
});

test('it should provide correct args when using mountAfterId', () => {
  let sectionOneDur = 400;
  let sectionThreeCtrl = jest.fn();
  let sectionThreeDur = 800;
  let sectionThreeMountPoint = -100;

  const p = new ParallaxProvider([
    {
      id: 1,
      mountPoint: 0,
      duration: sectionOneDur,
      controller: () => {},
    },
    {
      mountPoint: 0,
      duration: 800,
      controller: () => {},
    },
    {
      mountPoint: sectionThreeMountPoint,
      mountAfterId: 1,
      duration: sectionThreeDur,
      controller: sectionThreeCtrl,
    },
  ]);

  global.pageYOffset = 50;
  events.scroll();

  expect(sectionThreeCtrl).toBeCalledWith(
    global.pageYOffset - sectionOneDur - sectionThreeMountPoint,
    sectionThreeDur,
  );
});

describe('Error states', () => {
  test('throw error when mounting after a non existent id', () => {
    expect(() => {
      const p = new ParallaxProvider([
        {
          id: 1,
          mountPoint: 0,
          duration: 500,
          controller: () => {},
        },
        {
          mountPoint: 0,
          duration: 800,
          controller: () => {},
        },
        {
          mountPoint: 0,
          mountAfterId: 100,
          duration: 500,
          controller: () => {},
        },
      ]);
    }).toThrow(Error);
  });

  test('throw error when mounting after itself', () => {
    expect(() => {
      const p = new ParallaxProvider([
        {
          mountPoint: 0,
          duration: 500,
          controller: () => {},
        },
        {
          mountPoint: 0,
          duration: 800,
          controller: () => {},
        },
        {
          id: 'test',
          mountPoint: 0,
          mountAfterId: 'test',
          duration: 500,
          controller: () => {},
        },
      ]);
    }).toThrow(Error);
  });

  test('throw error when first module uses mountAfterId', () => {
    expect(() => {
      const p = new ParallaxProvider([
        {
          mountPoint: 0,
          duration: 500,
          mountAfterId: 'test',
          controller: () => {},
        },
        {
          id: 'test',
          mountPoint: 0,
          duration: 800,
          controller: () => {},
        },
        {
          mountPoint: 0,
          duration: 500,
          controller: () => {},
        },
      ]);
    }).toThrow(Error);
  });

  test('throw error when two modules share an id', () => {
    expect(() => {
      const p = new ParallaxProvider([
        {
          id: 1,
          mountPoint: 0,
          duration: 500,
          controller: () => {},
        },
        {
          id: 1,
          mountPoint: 0,
          duration: 800,
          controller: () => {},
        },
        {
          mountPoint: 0,
          duration: 500,
          controller: () => {},
        },
      ]);
    }).toThrow(Error);
  });
});

// TODO Tue 08 Jan 2019 19:23:42 GMT
// use different types as id to see what happens
// missing properties in module obj (ie provide defaults)
//
// provide warning when using mountAfterId and absolute mount type together
