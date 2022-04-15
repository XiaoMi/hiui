import React, { useRef, useState } from "react";
import { addDecorator } from "@storybook/react";
// import DocViewer from '../externals/doc-viewer'
import theme from "./themes/code-theme";
// import "@hi-ui/hiui/es/base-css";
// import { Badge } from '../externals/doc-components'
import { withPerformance } from "storybook-addon-performance";
// import { Meta, ArgsTable, Source, Story, Canvas } from '@storybook/addon-docs/blocks'
// import { Title, Subtitle, Description, Primary, ArgsTable, Stories, PRIMARY_STORY } from '@storybook/addon-docs/blocks'
// import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import LocaleProvider from '@hi-ui/locale-context'
import HiUIProvider from '@hi-ui/provider'

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
  function withHiUIProvider(Story, context) {
    const accentColor = context.globals.accentColor;
    const locale = context.globals.locale;
    const radius = context.globals.radius;

    const theme = React.useMemo(() => {
      const customRadiusSizeMap = {
        sm: {
          sm: '2px',
          md: '2px',
          lg: '4px',
        },
        md: {
          sm: '2px',
          md: '4px',
          lg: '6px',
        },
        lg: {
          sm: '4px',
          md: '6px',
          lg: '8px',
        }
      }

      return {
        border: {
          radius: customRadiusSizeMap[radius] || {}
        }
      }
    }, [radius])

    return (
      <HiUIProvider accentColor={accentColor} locale={locale} theme={theme}>
        {/* <LocaleProvider locale={locale}> */}
          <Story {...context} />
        {/* </LocaleProvider> */}
      </HiUIProvider>
    );
  },
  function withLayout(Story, context) {
    const { direction } = context.globals;
    // TODO: Inject Container placed UI
    return (
      <div className="hi-v4-box" style={{
        direction,
        border: '1px solid rgb(230, 231, 232)',
        borderRadius: 2,
        padding: 36,
        minWidth: 360
      }}
      >
        <Story {...context} />
      </div>
    );
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
  withPerformance,
];

/**
 * Add global stories context config
 */
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "centered",
  options: {
    storySort: {
      locales: "en-US",
    },
  },
};

/**
 * Add global toolbar menus for switching to theme, i18n and RTL-LTR
 */
export const globalTypes = {
  accentColor: {
    name: "AccentColor",
    description: "Global accentColor for components",
    defaultValue: "",
    toolbar: {
      icon: "circlehollow",
      items: [
        'brandblue',
        'ultramarine',
        'pastelblue',
        'skyblue',
        'orange',
        'amber',
        'purple',
        'cyan',
    ],
    },
  },
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "zh-CN",
    toolbar: {
      icon: "globe",
      items: [
        { value: "zh-CN", right: "🇨🇳", title: "中文" },
        { value: "en-US", right: "🇺🇸", title: "English" },
        { value: "zh-HK", right: "🇨🇳", title: "香港" },
        { value: "zh-TW", right: "🇨🇳", title: "台湾" },
      ],
    },
  },
  direction: {
    name: "Direction",
    description: "Direction for layout",
    defaultValue: "LTR",
    toolbar: {
      icon: "transfer",
      items: ["LTR", "RTL"],
    },
  },
  radius: {
    name: "Radius",
    description: "Global Border Radius for components",
    defaultValue: "",
    toolbar: {
      icon: "lightning",
      items: ["sm", "md", "lg"],
    },
  },
};
