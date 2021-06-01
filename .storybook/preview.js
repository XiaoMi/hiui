import React, { useRef, useState } from 'react'
import { addDecorator } from '@storybook/react'
import DocViewer from '../externals/doc-viewer'
import theme from './themes/code-theme'
import '@hi-ui/hiui/es/base-css'
import { Badge } from '../externals/doc-components'
import { withPerformance } from 'storybook-addon-performance'
// import { Meta, ArgsTable, Source, Story, Canvas } from '@storybook/addon-docs/blocks'
// import { Title, Subtitle, Description, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs/blocks'
// import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'

// import Popper from '../packages/ui/popper/src/index.js'
// import Alert from '../packages/ui/alert/es/index.js'
// import Select from '../packages/ui/select/src/index.js'
// import Loading from '../packages/ui/loading/src'
// import Avatar from '../packages/ui/avatar/src'
// import Checkbox from '../packages/ui/checkbox/src'
// import EmptyState from '../packages/ui/empty-state/src'

/**
 * Add global stories Decorators for switching codePreview and theme, i18n provider
 */
export const decorators = [
  function withThemeProvider(Story, context) {
    const theme = context.globals.theme
    console.log('[ theme ] >', theme)
    console.dir(Story())
    console.dir(context)

    // TODO: Inject HiUI ThemeProvider
    return (
      <div theme={theme}>
        <Story {...context} />
      </div>
    )
  },
  function withLayout(Story, context) {
    // TODO: Inject Container placed UI
    return (
      <div className="hi-v4-box">
        <Story {...context} />
      </div>
    )
  },
  // function withCodeEditor (cb, props) {
  //   const { argTypes, args } = props
  //   const Component = props.parameters.component
  //   const { parameters = {}, globals } = props
  //   const {
  //     storySource = {},
  //     args: { desc = '' },
  //   } = parameters
  //   const code = storySource.source
  //   console.log('props', props)
  //   return (
  //     <DocViewer
  //       desc={desc}
  //       code={code}
  //       // scope={{ Popper, Alert, Select, useRef, useState, globals, Avatar, Loading, Checkbox, EmptyState }}
  //       prefix={'alert-autoClose'}
  //     />
  //   )
  // },
  withPerformance
]

/**
 * Add global stories context config
 */
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
  options: {
    storySort: {
      locales: 'en-US',
    },
  },
}

/**
 * Add global toolbar menus for switching to theme, i18n and RTL-LTR
 */
export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark'],
    },
  },
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'zh',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'zh', right: '🇨🇳', title: '中文' },
        { value: 'en', right: '🇺🇸', title: 'English' },
      ],
    },
  },
  direction: {
    name: 'Direction',
    description: 'Direction for layout',
    defaultValue: 'LTR',
    toolbar: {
      icon: 'transfer',
      items: ['LTR', 'RTL'],
    },
  },
}
