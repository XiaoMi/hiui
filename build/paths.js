const path = require('path')

const basePath = path.resolve(__dirname, '..')

const docEnv = process.env.DOC_ENV
// const nodeEnv = process.env.NODE_ENV
const isGithub = docEnv === 'github'
// const isDevelopment = nodeEnv === 'development'

module.exports = {
  publicPath: isGithub ? '/hiui/' : '/',
  siteEntry: path.join(basePath, 'site', 'main.js'),
  siteLibs: path.join(basePath, 'libs'),
  siteBase: path.join(basePath, 'site'),
  siteTemplate: path.join(basePath, 'site', 'index.html'),
  components: path.join(basePath, 'components')
}
