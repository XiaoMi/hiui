#!/usr/bin/env node
// https://florian.ec/blog/rollup-scss-css-modules/
// https://github.com/rollup/plugins
// https://blog.harveydelaney.com/creating-your-own-react-component-library/

const path = require('path')
const rollup = require('rollup')
// resolve将我们编写的源码与依赖的第三方库进行合并
const { nodeResolve } = require('@rollup/plugin-node-resolve')
// babel插件用于处理es6代码的转换，使转换出来的代码可以用于不支持es6的环境使用
const { babel } = require('@rollup/plugin-babel')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')
// 解决rollup.js无法识别CommonJS模块
const commonjs = require('@rollup/plugin-commonjs')
// 支持typescript
const typescript = require('rollup-plugin-typescript2')
// 使rollup可以使用postCss处理样式文件less、css等
const postcss = require('rollup-plugin-postcss')
// 可以处理组件中import图片的方式，将图片转换成base64格式，但会增加打包体积，适用于小图标
// const image = require('@rollup/plugin-image')
// 压缩打包代码
// const { terser } = require('rollup-plugin-terser')
// PostCSS 处理css定义的变量
const simplevars = require('postcss-simple-vars')
const postcssImport = require('postcss-import')
// PostCSS 处理less嵌套样式写法
const nested = require('postcss-nested')
// 可以提前适用最新css特性
const postcssPresetEnv = require('postcss-preset-env')
// // css 代码压缩
// const cssnano = require('cssnano')
// // 用于打包生成*.d.ts文件
// const dts = require('rollup-plugin-dts').default
// // 多入口
// const multi = require('@rollup/plugin-multi-entry')
// // 扩展
// const extensions = require('rollup-plugin-extensions')

const currentWorkingPath = process.cwd()
const packageJson = require(path.join(currentWorkingPath, 'package.json'))
const { name } = packageJson

function getBabelConfig() {
  // const BABEL_ENV = process.env.BABEL_ENV

  const presets = [
    [
      '@babel/env'
      // {
      //   loose: true,
      //   modules: BABEL_ENV === 'cjs' ? 'commonjs' : false,
      //   targets: {
      //     esmodules: BABEL_ENV === 'esm' ? true : undefined,
      //   },
      // },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ]

  const plugins = ['@babel/plugin-transform-runtime']

  return {
    presets,
    plugins
  }
}

// https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
function getExternals(pkg) {
  /** @type {(string | RegExp)[]} */
  const external = [/@babel\//, /tslib/, /style-inject/]
  // const external = [/node_modules\//]
  const peerDeps = Object.keys(pkg.peerDependencies || {})

  return external.concat(peerDeps).concat(Object.keys(pkg.dependencies || {}))
}

const babelConfig = getBabelConfig()

// 入口文件我这里在components下统一导出所有自定义的组件
const inputPath = path.join(currentWorkingPath, 'src/index.tsx')

// Little workaround to get package name without scope
const fileName = name.replace('@md-ui/', '')
console.log(1, inputPath, fileName, packageJson.main)

const externals = getExternals(packageJson)
console.log(externals)

// see below for details on the options
const inputOptions = {
  input: inputPath,
  // 将模块视为外部模块，不会打包在库中
  external: externals,
  // 自定义警告事件，这里由于会报THIS_IS_UNDEFINED警告，这里手动过滤掉
  // onwarn(warning) {
  //   if (warning.code === 'THIS_IS_UNDEFINED') {
  //     return
  //   }
  // },
  // 插件
  plugins: [
    // multi(),
    // extensions({
    //   extensions: ['.ts', '.tsx', '.js', '.jsx'],
    //   resolveIndex: true,
    // }),
    peerDepsExternal(),
    // 告诉 Rollup 如何查找外部模块并安装它
    nodeResolve(),
    // 这里有些引入使用某个库的api但报未导出该api通过namedExports来手动导出
    commonjs(),
    // dts(),
    typescript({ useTsconfigDeclarationDir: true }),
    // image(),
    postcss({
      plugins: [
        postcssImport(),
        simplevars(),
        nested(),
        // cssnext({ warnForDuplicates: false, }),
        postcssPresetEnv()
        // cssnano(),
      ],
      // 处理.css和.scss文件
      extensions: ['.css', '.scss'],
      // TODO: styleInject 提取为公用模块
      extract: false, // 提取 css 文件
      inject: true,
      // modules: true, // 模块化
      use: ['sass']
    }),
    // babel 处理不包含 node_modules 文件的所有 js
    babel({
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      babelHelpers: 'runtime',
      exclude: ['node_modules/**'],
      ...babelConfig
    })
    // 生产环境执行 terser 压缩代码
    // terser(),
  ]
  // manualChunks: (id) => path.parse(id).name,
}

const outputOptions = [
  {
    // file: packageJson.main,
    dir: '/Users/flcwl/micode/hiui/packages/ui/hello/lib/cjs',
    format: 'cjs',
    sourcemap: true,
    exports: 'named',
    globals: { react: 'React' },
    preserveModules: true,
    preserveModulesRoot: 'src',
    chunkFileNames: '[name].js'
  },
  {
    dir: '/Users/flcwl/micode/hiui/packages/ui/hello/lib/esm',
    format: 'esm',
    sourcemap: true,
    globals: { react: 'React' },
    preserveModules: true,
    preserveModulesRoot: 'src',
    chunkFileNames: '[name].js'
  }
]

async function build() {
  // create bundle
  const bundle = await rollup.rollup(inputOptions)
  // loop through the options and write individual bundles
  outputOptions.forEach(async (options) => {
    await bundle.write(options)
  })
}

build()
