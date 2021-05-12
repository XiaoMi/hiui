const BABEL_MODULE_ENV = process.env.BABEL_MODULE_ENV

module.exports = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        targets: {
          esmodules: BABEL_MODULE_ENV === 'esm' ? true : undefined,
        },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: ['@babel/plugin-external-helpers', '@babel/plugin-transform-runtime'],
}
