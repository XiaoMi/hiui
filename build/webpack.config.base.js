const rehypePrism = require('@mapbox/rehype-prism')
const paths = require('./paths')

const IS_GITHUB = process.env.DOC_ENV === 'github'

console.log(IS_GITHUB)

module.exports = {
  output: {
    publicPath: IS_GITHUB ? '/hiui/' : '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json'],
    alias: {
      '@components': paths.components,
      '@libs': paths.siteLibs,
      '@static': paths.siteStatic
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: require.resolve('./loaders'),
            options: {
              from: /<BASE_URL>/g,
              to: IS_GITHUB ? '/hiui' : ''
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: ['@babel/plugin-proposal-class-properties']
            }
          }
        ],
        exclude: [/node_modules/]
      },
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
      },
      {
        test: /\.mdx$/,
        use: [
          {
            loader: require.resolve('./loaders'),
            options: {
              from: /<BASE_URL>/g,
              to: IS_GITHUB ? '/hiui' : ''
            }
          },
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
        use: [
          {
            loader: require.resolve('./loaders'),
            options: {
              from: /<BASE_URL>/g,
              to: IS_GITHUB ? '/hiui' : ''
            }
          },
          {
            loader: 'raw-loader'
          }
        ]
      }
    ]
  }
}
