const path = require('path')

module.exports = {
  process(src, filename, config, options) {
    return (
      'module.exports = { default: () => { return ' +
      JSON.stringify(path.basename(filename)) +
      '}};'
    )
  },
}
