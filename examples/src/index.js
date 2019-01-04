import ParallaxProvider from '../../src';

const firstpage = document.querySelector('.firstpage');
const fg = document.querySelector('.foreground');
const mg = document.querySelector('.middleground');
const bg = document.querySelector('.background');
const title = document.querySelector('.firstpage h1');

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

export default new ParallaxProvider([
  {
    mountPoint: 0,
    duration: 500,
    controller: phaseOne,
  },
  {
    mountPoint: 0,
    duration: 300,
    controller: phaseOneTransition,
  },
]);
