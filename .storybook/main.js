// const customWebpack = require('./webpack.config.js');
// .storybook/main.js

const path = require("path")
module.exports = {
  stories: ["../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)", "../packages/**/*.stories.@(js|jsx|ts|tsx|mdx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "storybook-addon-react-live-edit"],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../")
    })

    // Return the altered config
    return config
  }
}
