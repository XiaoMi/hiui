const sass = require('node-sass')
const { readFileSync } = require('fs')
const postcss = require('postcss')
const path = require('path')
const postcssConfig = require('../postcss.config')

function transformSass (sassFile, config = {}) {
  const { cwd = process.cwd() } = config
  const resolvedSassFile = path.resolve(cwd, sassFile)

  let data = readFileSync(resolvedSassFile, 'utf-8')
  data = data.replace(/^\uFEFF/, '')

  return new Promise((resolve, reject) => {
    if (resolve) {
      sass.render({
        file: resolvedSassFile,
        includePaths: ['./node_modules'],
        data: data,
        outputStyle: 'compressed'
      }, function (error, result) {
        // console.log(result.css)
        // console.log(result.css.toString(), 'this is result')
        if (!error) {
          const css = postcss(postcssConfig.plugins).process(result.css.toString()).then(r => r.css)
          resolve(css)
        } else {
          reject(error)
        }
      })
    } else {
      throw new Error('Error')
    }
  })
}

module.exports = transformSass
