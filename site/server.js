const webpack = require('webpack')
const config = require('../build/webpack.dev.config.js')
const WebpackDevServer = require('webpack-dev-server')
const PORT = process.env.PORT || 8000

config.entry.main.unshift(
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://127.0.0.1:${PORT}/`,
  'webpack/hot/only-dev-server',
  './main'
)

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  hot: true,
  noInfo: true,
  quiet: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
})

server.listen(PORT, () => {
  console.log(`server started at localhost:${PORT} , please open localhost:${PORT}`)
})
