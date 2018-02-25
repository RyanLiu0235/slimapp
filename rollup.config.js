var uglify = require('rollup-plugin-uglify')
var cjs = require('rollup-plugin-commonjs')
var resolve = require('rollup-plugin-node-resolve')
var version = require('./package.json').version
var banner =
  `/**
 * slimapp v${version}
 * (c) ${new Date().getFullYear()} Ryan Liu
 * @license WTFPL
 */`

export default [{
  input: './src/index.js',
  output: {
    file: './dist/slim.js',
    format: 'umd',
    name: 'slim',
    globals: 'slim',
    banner
  },
  plugins: [cjs(), resolve()]
}, {
  input: './src/index.js',
  output: {
    file: './dist/slim.min.js',
    format: 'umd',
    name: 'slim',
    globals: 'slim',
    banner
  },
  plugins: [cjs(), uglify(), resolve()]
}]
