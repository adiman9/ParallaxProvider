import ParallaxProvider from '../src';

beforeAll;

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

test('it calls the controller on scroll', () => {
  const events = {};
  global.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
  });

  const sectionCtrl = jest.fn();

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: 500,
      controller: sectionCtrl,
    },
  ]);

  events.scroll();

  expect(sectionCtrl).toHaveBeenCalled();
});

test('correct offset when scroll is inside the section', () => {
  const events = {};
  global.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
  });
  global.pageYOffset = 10;

  const sectionCtrl = jest.fn();
  const duration = 500;

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: duration,
      controller: sectionCtrl,
    },
  ]);

  events.scroll();

  expect(sectionCtrl).toHaveBeenCalledWith(global.pageYOffset, duration);

  global.pageYOffset = 1000;
  events.scroll();

  expect(sectionCtrl).toHaveBeenCalledWith(global.pageYOffset, duration);
});

test('correct offset after section', () => {
  const events = {};
  global.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
  });
  global.pageYOffset = 1000;

  const sectionCtrl = jest.fn();
  const duration = 500;

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: duration,
      controller: sectionCtrl,
    },
  ]);

  events.scroll();

  expect(sectionCtrl).toHaveBeenCalledWith(global.pageYOffset, duration);
});

test('correct offset when before section', () => {
  const events = {};
  global.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
  });
  global.pageYOffset = 10;

  const sectionCtrl = jest.fn();
  const sectionOneDur = 500;
  const sectionTwoDur = 800;

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: sectionOneDur,
      controller: () => {},
    },
    {
      mountPoint: 0,
      duration: sectionTwoDur,
      controller: sectionCtrl,
    },
  ]);

  events.scroll();

  expect(sectionCtrl).toHaveBeenCalledWith(
    global.pageYOffset - sectionOneDur,
    sectionTwoDur,
  );
});

test('correct offset during section two', () => {
  const events = {};
  global.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
  });
  global.pageYOffset = 550;

  const sectionCtrl = jest.fn();
  const sectionOneDur = 500;
  const sectionTwoDur = 800;

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: sectionOneDur,
      controller: () => {},
    },
    {
      mountPoint: 0,
      duration: sectionTwoDur,
      controller: sectionCtrl,
    },
  ]);

  events.scroll();

  expect(sectionCtrl).toHaveBeenCalledWith(
    global.pageYOffset - sectionOneDur,
    sectionTwoDur,
  );
});

test('correct offset after section two', () => {
  const events = {};
  global.addEventListener = jest.fn((event, cb) => {
    events[event] = cb;
  });
  global.pageYOffset = 5000;

  const sectionCtrl = jest.fn();
  const sectionOneDur = 500;
  const sectionTwoDur = 800;

  const p = new ParallaxProvider([
    {
      mountPoint: 0,
      duration: sectionOneDur,
      controller: () => {},
    },
    {
      mountPoint: 0,
      duration: sectionTwoDur,
      controller: sectionCtrl,
    },
  ]);

  events.scroll();

  expect(sectionCtrl).toHaveBeenCalledWith(
    global.pageYOffset - sectionOneDur,
    sectionTwoDur,
  );
});
