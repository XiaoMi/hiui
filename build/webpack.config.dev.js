const webpack = require('webpack')
const merge = require('webpack-merge')
const paths = require('./paths')
const baseConfig = require('./webpack.config.base')

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: [paths.siteEntry],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    host: '10.221.68.181',
    port: 4200,
    disableHostCheck: false,
    hot: true,
    hotOnly: false,
    overlay: true,
    quiet: true,
    inline: true,
    contentBase: paths.siteBase,
    watchContentBase: true,
    publicPath: '/',
    open: true,
    stats: {
      colors: true
    },
    clientLogLevel: 'none',
    historyApiFallback: true
  }
})
