const HtmlWebpackPlugin = require('html-webpack-plugin')
// const rehypePrism = require('@mapbox/rehype-prism')

const IS_GITHUB = process.env.DOC_ENV === 'github'

module.exports = {
  output: {
    publicPath: IS_GITHUB ? '/hiui/' : '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /(fontawesome-webfont)\.(svg)$/,
        loader: 'file-loader',
        options: {
          name: './static/fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: './static/img/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)/,
        loader: 'file-loader',
        options: {
          name: './static/fonts/[name].[ext]?[hash]'
        }
      }
    ]
  }
}
