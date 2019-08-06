const path = require('path')
const basePath = path.resolve(__dirname, '..')

module.exports = {
  basePath,
  siteEntry: path.join(basePath, 'site', 'main.js'),
  siteLibs: path.join(basePath, 'libs'),
  siteBase: path.join(basePath, 'site'),
  siteTemplate: path.join(basePath, 'site', 'index.html'),
  siteStatic: path.join(basePath, 'site', 'static'),
  components: path.join(basePath, 'components')
}
