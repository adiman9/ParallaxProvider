const rollupBabel = require('rollup-plugin-babel')
import pkg from './package.json';

const LIB_NAME = 'ParallaxProvider';

export default {
  input: 'src/index.js',
  output: [
    {
      name: LIB_NAME,
      file: pkg.browser,
      format: 'umd'
    },
    {
      name: LIB_NAME,
      file: pkg.main,
      format: 'cjs'
    },
    {
      name: LIB_NAME,
      file: pkg.module,
      format: 'es'
    },
  ],
  plugins: [
    rollupBabel({
      exclude: 'node_modules/**',
      babelrc: true,
      runtimeHelpers: false,
    }),
  ]
}

