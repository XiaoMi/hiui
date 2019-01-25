const path = require('path')
const webpack = require('webpack')
const basePath = path.resolve(__dirname, '../')

module.exports = {
  mode: 'development',
  entry: {
    main: ['babel-polyfill', `${path.resolve(basePath, 'site/main.js')}`],
    // 列出第三方库
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(basePath, 'dist'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.web.js', '.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        // exclude: ['node_modules', 'bower_components'],
        include: [
          path.resolve(__dirname, '../component'),
          path.resolve(__dirname, '../libs'),
          path.resolve(__dirname, '../locales'),
          path.resolve(__dirname, '../site'),
          path.resolve(__dirname, '../template'),
          path.resolve(__dirname, '../transform'),
          path.resolve(__dirname, '../node_modules/@hi-ui/classic-theme')
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
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
      },
      {
        test: /\.md$/,
        loader: 'raw-loader'
      }
    ]
  },
  stats: {
    chunks: false,
    children: false
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ]
}
