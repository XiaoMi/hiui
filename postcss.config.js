module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: [
        'last 2 versions',
        'ie > 9'
      ]
    },
    'cssnano': {
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    }
  }
}
