const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const basePath = path.resolve(__dirname, '../')
const rehypePrism = require('@mapbox/rehype-prism')
const paths = require('./paths')

module.exports = {
  mode: process.env.NODE_ENV,
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
    publicPath: paths.publicPath,
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].chunk.[chunkhash].js'
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.web.js', '.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        // exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            }
          ]
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: '[name].[ext]?[hash]',
          outputPath: 'static/img'
        }
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
          outputPath: 'static/fonts'
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
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor'
        },
        runtime: {
          name: 'runtime'
        }
      }
    },
    minimizer: [new TerserPlugin()],
    usedExports: true,
    sideEffects: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CleanWebpackPlugin(['dist'], {
      root: basePath
    }),
    new ExtractTextPlugin({
      filename: 'styles.[hash].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      title: 'HIUI',
      publicPath: paths.publicPath,
      template: path.resolve(__dirname, '../site/index.template.html')
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
}
