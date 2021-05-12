const build = require('./build')
const cmd = require('./cmd')

const run = (options) => {
  build(options)
    .then(() => {
      if (!options.watch) {
        process.exit(0)
      }
    })
    .catch((err) => {
      console.error(err)
      process.exit((typeof err.code === 'number' && err.code) || 1)
    })
}

cmd(run)(process.argv)
