const rucksack = require('rucksack-css')
const autoprefixer = require('autoprefixer')

module.exports = {
  plugins: [
    rucksack(),
    autoprefixer({
      browsers: [
        'last 2 versions',
        'ie > 9'
      ]
    })
  ]
}
