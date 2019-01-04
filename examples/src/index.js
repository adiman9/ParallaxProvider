import ParallaxProvider from '../../src';

const fg = document.querySelector('.foreground');
const mg = document.querySelector('.middleground');
const bg = document.querySelector('.background');
const title = document.querySelector('.firstpage h1');

function phaseOne(offset) {
  const duration = 500;

  if (offset < duration) {
    const scaleAmt = 0.4 * Math.min(offset / duration, 1);
    fg.style.transform = `scale(${1 + scaleAmt})`;
    mg.style.transform = `scale(${1 + scaleAmt * 0.24})`;
    bg.style.transform = `scale(${1 + scaleAmt * 0.1})`;
    title.style.transform = `scale(${1 + scaleAmt * 0.8})`;
  }
}

export default new ParallaxProvider([
  {
    mountPoint: 0,
    controller: phaseOne,
  },
]);
