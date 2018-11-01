const gulp = require('gulp')
const babel = require('gulp-babel')
const path = require('path')
const through2 = require('through2')
const merge2 = require('merge2')
const runSequence = require('run-sequence')
const transformSass = require('./build/transformSass')
const rimraf = require('rimraf')

const cwd = process.cwd()
const libDir = path.join(cwd, 'lib')
const esDir = path.join(cwd, 'es')

const compile = modules => {
  rimraf.sync(modules !== false ? libDir : esDir)
  const sass = gulp
    .src(['components/**/*.scss'])
    .pipe(
      through2.obj(function (file, encoding, next) {
        this.push(file.clone())
        if (file.path.match(/\/style\/index\.scss$/)) {
          transformSass(file.path)
            .then(css => {
              file.contents = Buffer.from(css)
              file.path = file.path.replace(/\.scss$/, '.css')
              this.push(file)
              next()
            })
            .catch(e => {
              console.error(e)
            })
        } else {
          next()
        }
      })
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir))
  const assets = gulp
    .src(['components/**/*.@(png|svg|eot|ttf|woff|woff2|otf)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir))
  const js = gulp
    .src('components/**/*.js')
    .pipe(
      babel({
        presets: [
          [
            'env',
            {
              targets: {
                browsers: ['ie >= 6']
              },
              loose: true,
              modules: modules,
              useBuiltIns: 'usage'
            }
          ],
          'stage-0',
          'react'
        ],
        plugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]]
      })
    )
    .pipe(gulp.dest(modules === false ? esDir : libDir))
  return merge2([sass, assets, js])
}

gulp.task('compile', () => compile(false))

gulp.task('carry', () => {
  gulp.src(['./site/static/**/*.*'])
    .pipe(gulp.dest('./dist/static'))
})

gulp.task('default', () => {
  runSequence('compile')
})
