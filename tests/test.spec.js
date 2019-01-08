import ParallaxProvider from '../src';

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
  let events = {};
  let sectionOneCtrl = jest.fn();
  let sectionTwoCtrl = jest.fn();
  let sectionOneDur = 500;
  let sectionTwoDur = 800;

  beforeEach(() => {
    events = {};
    global.addEventListener = jest.fn((event, cb) => {
      events[event] = cb;
    });

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
