const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const glob = require('glob')

// 获取指定路径下的入口文件
const getFilePath = function (globPath) {
  var files = glob.sync(globPath)
  var entries = {}

  files.forEach(function (filepath) {
    // 取倒数第二层(layout下面的文件夹)做包名
    var split = filepath.split('/')
    var name = split[split.length - 2]

    entries[name + '/index'] = filepath
  })

  // console.log(entries)
  return entries
}

const basePath = path.resolve(__dirname, '../')
const entry = getFilePath(path.resolve(basePath, 'components/**/index.js'))

module.exports = {
  entry: entry,
  output: {
    path: path.resolve(basePath, 'lib'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
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
        test: /\.(eot|ttf|woff|woff2|otf)/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: './static/fonts'
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: './static/img/[name].[ext]?[hash]'
        }
      }
    ]
  },
  stats: {
    chunks: false,
    children: false
  },
  plugins: [
    new CleanWebpackPlugin(['lib'], {
      root: basePath
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        warnings: false
      }
    })
  ]
}
