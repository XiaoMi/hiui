const BABEL_MODULE_ENV = process.env.BABEL_MODULE_ENV

module.exports = function (api) {
  api.cache(true)
  console.log('——————————————BABEL_MODULE_ENV', BABEL_MODULE_ENV)

  const presets = [
    [
      '@babel/env',
      {
        loose: true,
        // modules: BABEL_MODULE_ENV === 'cjs' ? 'commonjs' : false,
        // targets: {
        //   esmodules: BABEL_MODULE_ENV === 'esm' ? true : undefined
        // }
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ]

  // const plugins = ['@babel/plugin-proposal-class-properties']
  const plugins = ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime']

  return {
    presets,
    plugins,
  }
}
