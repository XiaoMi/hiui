const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.dev')

const devServerConfig = Object.assign({}, webpackConfig.devServer)

WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerConfig)

const compiler = webpack(webpackConfig)

const devServer = new WebpackDevServer(compiler, devServerConfig)

devServer.listen(devServerConfig.port, devServerConfig.host, () => {
  console.log(`Server is started at http://${devServerConfig.host}:${devServerConfig.port}`)
})
