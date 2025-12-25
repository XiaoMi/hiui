const path = require('path')

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
  webpackFinal: async (config) => {
    const localeContextRoot = path.resolve(__dirname, '../packages/ui/locale-context')
    const localeSrcDir = path.join(localeContextRoot, 'src/locale')
    
    const newAlias = {
      '@hi-ui/locale-context/locale': localeSrcDir,
      '@hi-ui/locale-context$': path.join(localeContextRoot, 'src/index.ts'),
      '@hi-ui/locale-context': path.join(localeContextRoot, 'src'),
    }
    
    config.resolve.alias = {
      ...newAlias,
      ...config.resolve.alias,
    }
    
    const originalExtensions = config.resolve.extensions || []
    config.resolve.extensions = ['.ts', '.tsx', ...originalExtensions.filter(ext => ext !== '.ts' && ext !== '.tsx')]
    
    return config
  },
}
