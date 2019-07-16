const rehypePrism = require('@mapbox/rehype-prism')
const paths = require('./paths')

module.exports = {
  output: {
    publicPath: paths.publicPath,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json'],
    alias: {
      '@components': paths.components,
      '@libs': paths.siteLibs
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
        exclude: [/node_modules/]
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
  }
}
