import ParallaxProvider from '../../../src';

const firstpage = document.querySelector('.firstpage');
const thirdpage = document.querySelector('.thirdpage');
const fg = document.querySelector('.foreground');
const mg = document.querySelector('.middleground');
const bg = document.querySelector('.background');
const title = document.querySelector('.firstpage h1');
const phaseTwoTitleParts = document.querySelectorAll('.secondpage h1 span');
const logoimg = document.querySelector('.turtlemascot');
const app = document.querySelector('#app');
const imgs = document.querySelectorAll('.img');
const progressLine = document.querySelector('.progress-line');

// Tweening
function easeOutBack(t, b, c, d, s) {
  let v = s;
  let p = t;
  if (s === undefined) v = 1.70158;
  const val = c * ((p = p / d - 1) * p * ((v + 1) * p + v) + 1) + b;
  return val;
}

function phaseOne(offset, duration) {
  if (offset < duration) {
    const scaleAmt = 0.4 * Math.min(offset / duration, 1);
    fg.style.transform = `scale(${1 + scaleAmt})`;
    mg.style.transform = `scale(${1 + scaleAmt * 0.24})`;
    bg.style.transform = `scale(${1 + scaleAmt * 0.1})`;
    title.style.transform = `scale(${1 + scaleAmt * 0.8})`;
  }
}

function phaseOneTransition(offset, duration) {
  if (offset < 0) {
    firstpage.style.opacity = '1';
  } else if (offset < duration) {
    const perc = offset / duration;
    firstpage.style.display = 'block';
    firstpage.style.opacity = `${1 - perc}`;
  } else {
    firstpage.style.opacity = '0';
    firstpage.style.display = 'none';
  }
}

function phaseTwo(offset, duration) {
  const MIDDLE_TRIGGER = 250;

  if (offset < 0) {
    phaseTwoTitleParts[0].style.transform = `translate3d(0, 0, 0)`;
    phaseTwoTitleParts[1].style.transform = `translate3d(0, 0, 0)`;
    phaseTwoTitleParts[2].style.transform = `translate3d(0, 0, 0)`;
  } else if (offset < duration) {
    phaseTwoTitleParts[0].style.display = `inline-block`;
    phaseTwoTitleParts[1].style.display = `inline-block`;
    phaseTwoTitleParts[2].style.display = `inline-block`;

    phaseTwoTitleParts[0].style.transform = `translate3d(0, -${offset}px, 0)`;
    phaseTwoTitleParts[1].style.transform = `translate3d(0, 0, 0)`;
    phaseTwoTitleParts[2].style.transform = `translate3d(0, ${offset}px, 0)`;

    if (offset > MIDDLE_TRIGGER) {
      phaseTwoTitleParts[1].style.transform = `translate3d(-${offset -
        MIDDLE_TRIGGER}px, 0, 0)`;
    }
  } else {
    phaseTwoTitleParts[0].style.display = `none`;
    phaseTwoTitleParts[1].style.display = `none`;
    phaseTwoTitleParts[2].style.display = `none`;
  }
}

function turtleExpand(offset, duration) {
  if (offset < 0) {
    logoimg.style.transform = `scale(0)`;
  } else if (offset < duration) {
    const scaleAmt = easeOutBack(offset, 0, 1.1, duration);
    logoimg.style.transform = `scale(${scaleAmt})`;
  }
}

function getHeightOfEl(el) {
  const styles = window.getComputedStyle(el);
  const margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
  const height = el.clientHeight || el.offsetHeight || el.scrollHeight;

  return Math.ceil(height + margin);
}

function calcScroll(offset, duration) {
  if (offset < 0) {
    app.style.transform = `translate3d(0, 0, 0)`;
  } else if (offset < duration) {
    app.style.transform = `translate3d(0, -${offset}px, 0)`;
    imgs[0].style.transform = `translate3d(0, -${offset * 0.1}px, 0)`;
    imgs[1].style.transform = `translate3d(0, -${offset * 0.25}px, 0)`;

    const progressTrigger = duration * 0.2;

    if (offset > progressTrigger) {
      const progressDur = duration - progressTrigger;
      const progressOff = offset - progressTrigger;
      const progress = Math.min(1, progressOff / progressDur) * 100;
      progressLine.style.transform = `translate3d(0, -${100 - progress}%, 0)`;
    } else {
      progressLine.style.transform = `translate3d(0, -100%, 0)`;
    }
  }
}

export default new ParallaxProvider([
  {
    id: 1,
    mountPoint: 0,
    duration: 500,
    controller: phaseOne,
  },
  {
    mountPoint: 0,
    duration: 300,
    controller: phaseOneTransition,
  },
  {
    mountPoint: 0,
    duration: 1000,
    controller: phaseTwo,
  },
  {
    mountPoint: 800,
    mountAfterId: 1,
    duration: 500,
    controller: turtleExpand,
  },
  {
    mountPoint: 100,
    duration: () => getHeightOfEl(thirdpage),
    controller: calcScroll,
  },
]);