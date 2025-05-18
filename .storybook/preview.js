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
// import HiUIProvider from '@hi-ui/provider'
import HiUIProvider from '../packages/ui/provider/src'

import jaJP from '../packages/ui/locale-context/src/locale/ja-JP'
import koKR from '../packages/ui/locale-context/src/locale/ko-KR'
import thTH from '../packages/ui/locale-context/src/locale/th-TH'
import viVN from '../packages/ui/locale-context/src/locale/vi-VN'
import frFR from '../packages/ui/locale-context/src/locale/fr-FR'
import deDE from '../packages/ui/locale-context/src/locale/de-DE'
import esES from '../packages/ui/locale-context/src/locale/es-ES'
import itIT from '../packages/ui/locale-context/src/locale/it-IT'
import ptPT from '../packages/ui/locale-context/src/locale/pt-PT'
import ptBR from '../packages/ui/locale-context/src/locale/pt-BR'
import ruRU from '../packages/ui/locale-context/src/locale/ru-RU'
import azAZ from '../packages/ui/locale-context/src/locale/az-AZ'
import hyAM from '../packages/ui/locale-context/src/locale/hy-AM'
import kaGE from '../packages/ui/locale-context/src/locale/ka-GE'
import uzUZ from '../packages/ui/locale-context/src/locale/uz-UZ'
import bsBA from '../packages/ui/locale-context/src/locale/bs-BA'
import bgBG from '../packages/ui/locale-context/src/locale/bg-BG'
import urPK from '../packages/ui/locale-context/src/locale/ur-PK'
import nlNL from '../packages/ui/locale-context/src/locale/nl-NL'
import csCZ from '../packages/ui/locale-context/src/locale/cs-CZ'
import daDK from '../packages/ui/locale-context/src/locale/da-DK'
import elGR from '../packages/ui/locale-context/src/locale/el-GR'
import fiFI from '../packages/ui/locale-context/src/locale/fi-FI'
import trTR from '../packages/ui/locale-context/src/locale/tr-TR'

HiUIProvider.extends('ja-JP', jaJP)
HiUIProvider.extends('ko-KR', koKR)
HiUIProvider.extends('th-TH', thTH)
HiUIProvider.extends('vi-VN', viVN)
HiUIProvider.extends('fr-FR', frFR)
HiUIProvider.extends('de-DE', deDE)
HiUIProvider.extends('es-ES', esES)
HiUIProvider.extends('it-IT', itIT)
HiUIProvider.extends('pt-PT', ptPT)
HiUIProvider.extends('pt-BR', ptBR)
HiUIProvider.extends('ru-RU', ruRU)
HiUIProvider.extends('az-AZ', azAZ)
HiUIProvider.extends('hy-AM', hyAM)
HiUIProvider.extends('ka-GE', kaGE)
HiUIProvider.extends('uz-UZ', uzUZ)
HiUIProvider.extends('bs-BA', bsBA)
HiUIProvider.extends('bg-BG', bgBG)
HiUIProvider.extends('ur-PK', urPK)
HiUIProvider.extends('nl-NL', nlNL)
HiUIProvider.extends('cs-CZ', csCZ)
HiUIProvider.extends('da-DK', daDK)
HiUIProvider.extends('el-GR', elGR)
HiUIProvider.extends('fi-FI', fiFI)
HiUIProvider.extends('tr-TR', trTR)

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
        <Story {...context} />
      </HiUIProvider>
    );
  },
  function withLayout(Story, context) {
    const { direction } = context.globals;
    // TODO: Inject Container placed UI
    return (
      <div className="hi-v5-box" style={{
        direction,
        border: '1px solid rgb(230, 231, 232)',
        borderRadius: 2,
        padding: 36,
        minWidth: 360,
        maxWidth: '100%'
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
        // 中文
        { value: "zh-CN", right: "🇨🇳", title: "简体中文" },
        { value: "zh-HK", right: "🇭🇰", title: "繁體中文（香港）" },
        { value: "zh-TW", right: "🇹🇼", title: "繁體中文（台灣）" },
        // 英语
        { value: "en-US", right: "🇺🇸", title: "English" },
        // 亚洲语言
        { value: "ja-JP", right: "🇯🇵", title: "日本語" },
        { value: "ko-KR", right: "🇰🇷", title: "한국어" },
        { value: "th-TH", right: "🇹🇭", title: "ไทย" },
        { value: "vi-VN", right: "🇻🇳", title: "Tiếng Việt" },
        // 欧洲语言
        { value: "fr-FR", right: "🇫🇷", title: "Français" },
        { value: "de-DE", right: "🇩🇪", title: "Deutsch" },
        { value: "es-ES", right: "🇪🇸", title: "Español" },
        { value: "it-IT", right: "🇮🇹", title: "Italiano" },
        { value: "pt-PT", right: "🇵🇹", title: "Português" },
        { value: "pt-BR", right: "🇧🇷", title: "Português (Brasil)" },
        { value: "nl-NL", right: "🇳🇱", title: "Nederlands" },
        { value: "el-GR", right: "🇬🇷", title: "Ελληνικά" },
        { value: "cs-CZ", right: "🇨🇿", title: "Čeština" },
        { value: "da-DK", right: "🇩🇰", title: "Dansk" },
        { value: "fi-FI", right: "🇫🇮", title: "Suomi" },
        { value: "tr-TR", right: "🇹🇷", title: "Türkçe" },
        // 俄语和斯拉夫语
        { value: "ru-RU", right: "🇷🇺", title: "Русский" },
        { value: "bg-BG", right: "🇧🇬", title: "Български" },
        { value: "bs-BA", right: "🇧🇦", title: "Bosanski" },
        // 高加索和中亚语言
        { value: "az-AZ", right: "🇦🇿", title: "Azərbaycan" },
        { value: "hy-AM", right: "🇦🇲", title: "Հայերեն" },
        { value: "ka-GE", right: "🇬🇪", title: "ქართული" },
        { value: "uz-UZ", right: "🇺🇿", title: "O'zbek" },
        // 南亚语言
        { value: "ur-PK", right: "🇵🇰", title: "اردو" },
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
