// 包抽离
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')
const glob = require('glob')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const resolve = (subpath) => {
  return path.join(process.cwd(), subpath)
}

const getUrlLoader = (type) => {
  return {
    loader: require.resolve('url-loader'),
    options: {
      limit: 10 * 1024,
      publicPath: '/',
      name: path.join('./', `${type}/[name].[hash:8].[ext]`)
    }
  }
}
const getDeepEntry = (srcDirName) => {
  const entry = {}
  glob.sync(srcDirName, { matchBase: true }).forEach((name, ...arg) => {
    let key = name.replace('/src', '')
    if (key.includes('.scss') || key.includes('.css') || key.includes('.stories') || key.includes('d.ts')) return
    const typeIndex = key.lastIndexOf('.')
    key = key.substring(0, typeIndex)
    entry[key] = resolve(name)
  })

  return entry
}
const allPackageModules = () => {
  var exts = {}
  fs.readdirSync(__dirname + '/node_modules').forEach((item) => {
    // 我没有使用es6
    if (item.indexOf('.') === 0) return
    exts[item] = 'commonjs ' + item
  })
  return exts
}
const entryFile = Object.assign(getDeepEntry('./src/**/*.*'))

module.exports = {
  entry: { ...entryFile },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    path: process.cwd() + '/es'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules']
  },
  externals: {
    react: 'react',
    React: 'react',
    'react-dom': 'react-dom',
    classNames: 'classNames',
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_' // 指向全局变量
    }
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-typescript'],
          plugins: [
            ['transform-class-properties'],
            ['@babel/plugin-syntax-class-properties'],
            ['@babel/plugin-syntax-jsx']
          ]
        }
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: getUrlLoader('imgs')
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: getUrlLoader('media')
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: getUrlLoader('fonts')
      }
    ]
  },
  plugins: [new CleanWebpackPlugin()]
}
