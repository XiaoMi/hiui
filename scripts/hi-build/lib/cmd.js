const { Command } = require('commander')
const { version } = require('../package.json')

const DEFAULT_FORMATS = 'esm,cjs'

const cmd = (callback) => {
  const action = (src, options) => {
    if (src) {
      options.src = src
    }

    if (options.compress === undefined) {
      // the default compress value is `true` for browser, `false` for Node.
      options.compress = options.target !== 'node'
    }

    callback(options)
  }

  const program = new Command()

  program
    .version(version)
    .arguments('<source>')
    .option('-d, --dist <dist>', 'Output directory to place bundles', './lib')
    .option(
      '-f, --format <format>',
      `Specify formats for build (any of ${DEFAULT_FORMATS})`,
      DEFAULT_FORMATS
    )
    .option(
      '-t, --target <target>',
      'Specify target environment for build (node or browser)',
      'browser'
    )
    .option('--compress', 'Build with compress', false)
    .option('--preserved', 'Build with preserved modules', true)
    .option('--source-maps', 'Generate source map', true)
    .option('--css-extract', 'Turns on Extract css', false)
    .option('--css-modules', 'Turns on css-modules', false)
    .description('Build once and exit')
    .action(action)

  return (argv) => program.parse(argv)
}

module.exports = cmd
