
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./inject-head-style.cjs.production.min.js')
} else {
  module.exports = require('./inject-head-style.cjs.development.js')
}
