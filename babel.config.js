module.exports = (api) => {
  // base config for rollup
  const babelPresetEnv = ['@babel/preset-env', { modules: false, targets: { ie: 11 } }];
  const config = {
    presets: [babelPresetEnv],
    plugins: ['lodash'],
  };

  // storybook and visual regression tests
  if (api.env('storybook')) {
    babelPresetEnv[1] = { targets: { esmodules: true } };
  }

  return config;
};
