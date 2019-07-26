const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const paths = require('./paths')
const baseConfig = require('./webpack.config.base')

const config = merge(baseConfig, {
  mode: 'production',
  entry: ['@babel/polyfill', paths.siteEntry],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
            options: {
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
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
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.DOC_ENV': JSON.stringify(process.env.DOC_ENV)
    }),
    new CleanWebpackPlugin(['dist'], {
      root: paths.basePath
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.[hash].css',
      chunkFilename: 'styles.chunk.[hash].css',
      ignoreOrder: false
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
})

module.exports = config
