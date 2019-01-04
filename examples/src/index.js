import ParallaxProvider from '../../src';

const {log} = window.console;

function phaseOne(offset) {
  log('phase one', offset);
}

export default new ParallaxProvider([
  {
    mountPoint: 0,
    controller: phaseOne,
  },
]);
