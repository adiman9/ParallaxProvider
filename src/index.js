export default class ParallaxProvider {
  constructor(modules) {
    if (modules && modules.length) {
      this.modules = modules;
      this.init();
    }
  }

  init() {
    const newModules = [];

    for (let i = 0; i < this.modules.length; i++) {
      const module = this.modules[i];

      const numNewModules = newModules.length;
      const previousModule = numNewModules
        ? newModules[numNewModules - 1]
        : null;

      let endPrevModule = 0;
      if (previousModule) {
        const prevDuration = previousModule.duration;
        endPrevModule = previousModule._absMountPoint + prevDuration;
      }

      const absMountPoint = endPrevModule + module.mountPoint;
      module._absMountPoint = absMountPoint;

      newModules.push(module);
    }

    this.modules = newModules;

    window.addEventListener('scroll', () => {
      const yoff = window.pageYOffset;

      this.modules.forEach(module => {
        module.controller(yoff - module._absMountPoint, module.duration);
      });
    });
  }
}
