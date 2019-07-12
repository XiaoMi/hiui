const path = require('path')
const webpack = require('webpack')
const basePath = path.resolve(__dirname, '../')
const rehypePrism = require('@mapbox/rehype-prism')

module.exports = {
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', `${path.resolve(basePath, 'site/main.js')}`],
    // 列出第三方库
    vendor: ['react', 'react-dom']
  },
  node: {
    fs: 'empty'
  },
  output: {
    path: path.resolve(basePath, 'dist'),
    publicPath: '/hiui/dist/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.web.js', '.js', '.jsx', '.json'],
    alias: {
      '@components': path.resolve(basePath, 'components'),
      '@libs': path.resolve(basePath, 'libs')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        },
        // exclude: ['node_modules', 'bower_components'],
        include: [
          path.resolve(__dirname, '../component'),
          path.resolve(__dirname, '../libs'),
          path.resolve(__dirname, '../locales'),
          path.resolve(__dirname, '../site'),
          path.resolve(__dirname, '../docs'),
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
        test: /\.mdx$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          },
          { loader: '@mdx-js/loader', options: { hastPlugins: [rehypePrism] } }
        ]
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
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor'
        }
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' })
  ]
}
