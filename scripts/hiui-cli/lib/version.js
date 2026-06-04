const pkg = require('../package.json')

function getCliVersionInfo () {
  return {
    name: pkg.name,
    version: pkg.version,
  }
}

module.exports = {
  getCliVersionInfo,
}
