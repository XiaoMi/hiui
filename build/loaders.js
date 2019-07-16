const { getOptions } = require('loader-utils')

module.exports = function (source) {
  if (typeof source !== 'string') {
    return source
  }
  const options = getOptions(this)
  const { from = '', to = '' } = options
  return source.replace(from, to)
}
