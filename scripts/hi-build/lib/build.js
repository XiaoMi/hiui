const Path = require('path')
const Fs = require('fs')
const rollup = require('rollup')
// resolve将我们编写的源码与依赖的第三方库进行合并
const { nodeResolve } = require('@rollup/plugin-node-resolve')
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
const { babel } = require('@rollup/plugin-babel')
// peer deps external
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
// 解决 rollup 无法识别 CommonJS 模块
const commonjs = require('@rollup/plugin-commonjs')
// 支持 typescript
const typescript = require('rollup-plugin-typescript2')
// 使rollup可以使用postCss处理样式文件less、css等
const postcss = require('rollup-plugin-postcss')
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
const image = require('@rollup/plugin-image')
// const json = require('@rollup/plugin-json')
// 压缩打包代码
const { terser } = require('rollup-plugin-terser')
// PostCSS 处理css定义的变量
const simplevars = require('postcss-simple-vars')
const postcssImport = require('postcss-import')
// PostCSS 处理less嵌套样式写法
const nested = require('postcss-nested')
// 可以提前适用最新css特性
const postcssPresetEnv = require('postcss-preset-env')
// css 代码压缩
// const cssnano = require('cssnano')
// 用于打包生成*.d.ts文件
// const dts = require('rollup-plugin-dts').default
// 多入口
// const multi = require('@rollup/plugin-multi-entry')
// 扩展
// const extensions = require('rollup-plugin-extensions')

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

const requireModule = (p) => Fs.existsSync(p) && require(p)

const resolvePackage = (cwd) => {
  const pkg = requireModule(Path.join(cwd, 'package.json'))
  return pkg || {}
}

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
const getExternals = (pkg) => {
  /** @type {(string | RegExp)[]} */
  const external = [/@babel\//, /tslib/, /style-inject/]
  const peerDeps = Object.keys(pkg.peerDependencies || {})

  return external.concat(peerDeps).concat(Object.keys(pkg.dependencies || {}))
}

const getRollupConfig = (input, outputPath, options, pkg) => {
  const external = getExternals(pkg)

  const {
    // target = 'web',
    // dist = './lib',
    format = 'cjs',
    sourceMaps = true,
    cssExtract = false,
    cssModules = false,
    preserved = true,
    compress = false,
  } = options

  console.log(
    `[ path.resolve(__dirname, '../babel.config.js') ] >`,
    Path.resolve(__dirname, '../babel.config.js')
  )
  const inputOptions = {
    input,
    external, // build As external modules
    onwarn(warning, warn) {
      warn(warning)
    },
    // treeshake: {
    //   propertyReadSideEffects: false,
    // },
    plugins: [
      peerDepsExternal(),
      nodeResolve(),
      commonjs(),
      // dts(),
      // json(),
      image(),
      typescript({ useTsconfigDeclarationDir: true }),
      postcss({
        plugins: [
          postcssImport(),
          simplevars(),
          nested(),
          postcssPresetEnv(),
          // cssnano(),
        ],
        extensions: ['.css', '.scss'],
        use: ['sass'],
        // TODO: styleInject 提取为公用模块
        inject: true,
        extract: cssExtract,
        modules: cssModules,
      }),
      babel({
        extensions: EXTENSIONS,
        babelHelpers: 'runtime', // 'runtime' | 'external'
        exclude: ['node_modules/**'],
        configFile: Path.resolve(__dirname, '../babel.config.js'),
        // plugins: babelConfig
        // ...babelConfig
      }),
      compress && terser(),
    ].filter(Boolean),
    // manualChunks: (id) => Path.parse(id).name,
  }

  const outputOptions = format.split(',').map((f) => {
    const _outputOptions = {
      dir: outputPath,
      format: f,
      sourcemap: sourceMaps,
      // exports: 'named',
      // freeze: false,
      // esModule: false,
      globals: { react: 'React' },
      chunkFileNames: '[name].js',
    }

    if (preserved) {
      _outputOptions.preserveModules = true
      _outputOptions.preserveModulesRoot = 'src'
    }

    return _outputOptions
  })

  return [inputOptions, outputOptions]
}

async function build([inputOptions, outputOptions]) {
  // create bundle
  const bundle = await rollup.rollup(inputOptions)

  // loop through the options and write individual bundles
  return Promise.all(
    outputOptions.map(async (options) => {
      console.log('[ options ] >', options)
      await bundle.write(options)
    })
  )
}

function main(inOptions) {
  const options = Object.assign({}, inOptions)

  // get pkg
  const cwd = process.cwd()
  const pkg = resolvePackage(cwd)

  // get input
  const inputPath = Path.join(cwd, options.src)
  const outputPath = Path.join(cwd, options.dist)

  // get rollup config
  const configs = getRollupConfig(inputPath, outputPath, options, pkg)
  console.log('[ configs ] >', configs)

  // build with rollup
  return build(configs)
}

module.exports = main
