const Path = require('path')
const Fs = require('fs')
const rollup = require('rollup')
const { babel, getBabelOutputPlugin } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const postcss = require('rollup-plugin-postcss')
const image = require('@rollup/plugin-image')
const { terser } = require('rollup-plugin-terser')
const simpleVars = require('postcss-simple-vars')
const postcssImport = require('postcss-import')
const cssNested = require('postcss-nested')
const postcssPresetEnv = require('postcss-preset-env')
const postcssFlexBugfix = require('postcss-flexbugs-fixes')
const cssnano = require('cssnano')

const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

const requireModule = (p) => Fs.existsSync(p) && require(p)

const resolvePackage = (cwd) => {
  const pkg = requireModule(Path.join(cwd, 'package.json'))
  return pkg || {}
}

const getBanner = (pkg) => {
  return `/** @LICENSE
 * ${pkg.name} v${pkg.version}
 * ${pkg.homepage}
 *
 * Copyright (c) ${pkg.author}.
 *
 * This source code is licensed under the ${pkg.license} license found in the
 * LICENSE file in the root directory of this source tree.
 */`
}

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
const getExternals = (pkg) => {
  /** @type {(string | RegExp)[]} */
  return [/tslib/]
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
        // rollup have to use EsModules to import
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
        babel({
          extensions: EXTENSIONS,
          babelHelpers: 'runtime',
          exclude: /node_modules/,
          // Use custom babel configuration to convenient unified manner
          ...babelConfig,
          babelrc: false,
          configFile: false,
        }),
        typescript({
          typescript: require('typescript'),
          // https://github.com/rollup/plugins/issues/568
          declaration: false,
          // declarationDir: Path.join(outputPath, 'types'),
        }),
        image(),
        postcss({
          plugins: [
            postcssFlexBugfix(),
            postcssPresetEnv({
              autoprefixer: {
                remove: false,
                flexbox: 'no-2009',
              },
              stage: 3,
            }),
            postcssImport(),
            simpleVars(),
            cssNested(),
            compress && cssnano(),
          ],
          extensions: ['.scss', '.css'],
          // Extract styleInject as a external module
          inject: (variableName) =>
            `;var __styleInject__=require('style-inject/dist/style-inject.es.js');__styleInject__(${variableName});`,
          extract: cssExtract,
          modules: cssModules,
        }),
        compress && terser(),
      ].filter(Boolean),
    }

    const outputOptions = {
      // Match rollup type rule of output
      format: isESM ? 'es' : type,
      dir: outputPath,
      sourcemap: sourceMaps,
      banner() {
        return getBanner(pkg)
      },
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

  const pkg = resolvePackage(cwd)

  const inputPath = Path.join(cwd, options.src)
  const outputPath = Path.join(cwd, options.dist)

  const configs = getRollupConfig(inputPath, outputPath, options, pkg)

  return build(configs)
}

module.exports = main
