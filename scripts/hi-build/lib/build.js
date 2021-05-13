const Path = require('path')
const Fs = require('fs')
const rollup = require('rollup')
const { babel, getBabelOutputPlugin } = require('@rollup/plugin-babel')
// resolve 将我们编写的源码与依赖的第三方库进行合并
const { nodeResolve } = require('@rollup/plugin-node-resolve')
// 解决 rollup 无法识别 CommonJS 模块
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const postcss = require('rollup-plugin-postcss')
const image = require('@rollup/plugin-image')
const { terser } = require('rollup-plugin-terser')
const simpleVars = require('postcss-simple-vars')
const postcssImport = require('postcss-import')
const cssNested = require('postcss-nested')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')
const replace = require('rollup-plugin-re')

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

const requireModule = (p) => Fs.existsSync(p) && require(p)

const resolvePackage = (cwd) => {
  const pkg = requireModule(Path.join(cwd, 'package.json'))
  return pkg || {}
}

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
const getExternals = (pkg) => {
  /** @type {(string | RegExp)[]} */
  return [/@babel\//, /tslib/, /style-inject/]
    .concat(Object.keys(pkg.peerDependencies || {}))
    .concat(Object.keys(pkg.dependencies || {}))
}

const getBabelConfig = (type, target) => {
  const isESM = type === 'esm'

  // check support targets
  const isBrowser = target === 'browser'
  const envTarget = isBrowser ? { browsers: ['last 2 versions', 'IE 10'] } : { node: 11 }

  const presets = [
    [
      '@babel/preset-env',
      {
        loose: true,
        // rollup using EsModules to import
        modules: false,
        targets: envTarget,
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ]

  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: isESM ? true : undefined,
      },
    ],
  ]

  return {
    presets,
    plugins,
  }
}

const getRollupConfig = (input, outputPath, options, pkg) => {
  const external = getExternals(pkg)
  console.log('[external  ] >', external)

  const {
    target = 'browser',
    format: formatOptions = 'cjs',
    sourceMaps = true,
    cssExtract = false,
    cssModules = false,
    preserved = true,
    compress = false,
  } = options

  const formats = formatOptions.split(',')

  const rollupConfigs = formats.map((type) => {
    const babelConfig = getBabelConfig(type, target)
    const isESM = type === 'esm'

    const inputOptions = {
      input,
      external,
      treeshake: {
        propertyReadSideEffects: false,
      },
      plugins: [
        nodeResolve(),
        commonjs(),
        typescript({
          typescript: require('typescript'),
          declaration: false,
          // declarationDir: Path.join(outputPath, 'types'),
        }),
        image(),
        postcss({
          plugins: [
            postcssPresetEnv(),
            postcssImport(),
            simpleVars(),
            cssNested(),
            compress && cssnano(),
          ],
          extensions: ['.scss', '.css'],
          use: ['sass'],
          inject: true,
          // TODO: styleInject 提取为公用模块
          extract: cssExtract,
          modules: cssModules,
        }),
        babel({
          extensions: EXTENSIONS,
          babelHelpers: 'runtime',
          exclude: /node_modules/,
          // 使用自定义构建配置，统一管理
          ...babelConfig,
          babelrc: false,
          configFile: false,
        }),
        replace({
          patterns: [
            {
              test: /\('.*\/node_modules\//,
              replace: `('`,
            },
          ],
        }),
        compress && terser(),
      ].filter(Boolean),
    }

    const outputOptions = {
      // Match rollup type rule of output
      format: isESM ? 'es' : type,
      dir: outputPath,
      sourcemap: sourceMaps,
      exports: 'named',
      globals: { react: 'React' },
      chunkFileNames: '[name].js',
      plugins: [
        getBabelOutputPlugin({
          presets: ['@babel/preset-env'],
          plugins: [
            [
              '@babel/plugin-transform-runtime',
              {
                useESModules: isESM ? true : undefined,
              },
            ],
          ],
        }),
      ],
    }

    if (preserved) {
      outputOptions.preserveModules = true
      outputOptions.preserveModulesRoot = 'src'
    }

    return [inputOptions, outputOptions]
  })

  return rollupConfigs
}

async function build(rollupConfigs) {
  return Promise.all(
    rollupConfigs.map(async ([inputOptions, outputOptions]) => {
      // create bundler with rollup
      const bundle = await rollup.rollup(inputOptions)

      // write individual bundles
      await bundle.write(outputOptions)
    })
  )
}

function main(userOptions) {
  const options = Object.assign({}, userOptions)

  const cwd = process.cwd()

  // get data from package.json
  const pkg = resolvePackage(cwd)

  const inputPath = Path.join(cwd, options.src)
  const outputPath = Path.join(cwd, options.dist)

  const configs = getRollupConfig(inputPath, outputPath, options, pkg)
  console.log('[ configs ] >', configs)

  return build(configs)
}

module.exports = main
