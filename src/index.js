export default class ParallaxProvider {
  constructor(modules) {
    if (modules && modules.length) {
      this.modules = modules;
      this.init();
    }
  }

  init() {
    window.addEventListener('scroll', () => {
      const yoff = window.pageYOffset;

      this.modules.forEach(module => {
        module.controller(yoff - module.mountPoint, module.duration);
      });
    });
  }
}
