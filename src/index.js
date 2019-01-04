export default class ParallaxProvider {
  constructor(modules) {
    if (modules && modules.length) {
      this.modules = modules;
      this.init();
    }
  }

  init() {
    const newModules = [];
    const moduleMap = [];

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

      let absMountPoint = endPrevModule + module.mountPoint;

      if (module.mountType === 'absolute') {
        absMountPoint = module.mountPoint;
      } else if (Object.prototype.hasOwnProperty.call(module, 'mountAfterId')) {
        if (module.mountAfterId === module.id) {
          throw new Error("Can't mount module relative to itself");
        }
        if (numNewModules === 0) {
          throw new Error("First module can't use mountAfterId");
        }
        if (!moduleMap[module.mountAfterId]) {
          throw new Error(
            `Trying to mount module after id ${
              module.mountAfterId
            } which does not exist. Be aware that you can only mount after a module that is declared before the current module in the modules array`,
          );
        }
        const mountAfter = moduleMap[module.mountAfterId];
        const mountAfterDur = mountAfter.duration;
        absMountPoint =
          mountAfter._absMountPoint + mountAfterDur + module.mountPoint;
      }

      module._absMountPoint = absMountPoint;

      newModules.push(module);

      if (moduleMap[module.id]) {
        throw new Error(
          `Module id ${
            module.id
          } is a duplicate. Please give every module a unique ID`,
        );
      }
      if (Object.prototype.hasOwnProperty.call(module, 'id')) {
        moduleMap[module.id] = module;
      }
    }

    this.modules = newModules;
    this.calcMinHeight();
    this.listenToScroll();
  }

  calcMinHeight() {
    let finalEndTime = 0;
    for (let i = 0; i < this.modules.length; i++) {
      const module = this.modules[i];
      const moduleDur = module.duration;
      const endTime = module._absMountPoint + moduleDur;
      finalEndTime = endTime > finalEndTime ? endTime : finalEndTime;
    }
    document.body.style.minHeight = `${finalEndTime + window.innerHeight}px`;
  }

  listenToScroll() {
    window.addEventListener('scroll', () => {
      this.calcMinHeight();
      const yoff = window.pageYOffset;

      this.modules.forEach(module => {
        module.controller(yoff - module._absMountPoint, module.duration);
      });
    });
  }
}
