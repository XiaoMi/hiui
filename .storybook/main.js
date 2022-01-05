module.exports = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../packages/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "storybook-addon-react-live-edit",
    "@storybook/preset-scss",
    "storybook-addon-performance/register",
  ],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => {
        if (['prefixCls'].includes(prop.name)) return false

        return (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true)
      }
    },
  },
}
