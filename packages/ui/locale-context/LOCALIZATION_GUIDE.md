# 国际化本地化指南

本指南提供了关于如何使用 HIUI 国际化系统的详细说明和实用示例。

## 目录

1. [快速开始](#快速开始)
2. [内置语言](#内置语言)
3. [使用方法](#使用方法)
4. [高级功能](#高级功能)
5. [常见问题](#常见问题)

## 快速开始

### 安装

```bash
npm install @hi-ui/locale-context
# 或
yarn add @hi-ui/locale-context
```

### 基本设置

```tsx
import React, { useState } from 'react'
import { LocaleProvider } from '@hi-ui/locale-context'

function App() {
  const [locale, setLocale] = useState('zh-CN')

  return (
    <LocaleProvider locale={locale}>
      <YourApplicationComponents />
    </LocaleProvider>
  )
}

export default App
```

## 内置语言

系统支持 30+ 种内置语言，分为以下几类：

### 🌏 亚洲语言 (7 种)

| 语言 | 代码 | 备注 |
|------|------|------|
| 中文简体 | `zh-CN` | 默认语言 |
| 中文繁体（香港） | `zh-HK` | 繁体中文 |
| 中文繁体（台湾） | `zh-TW` | 繁体中文 |
| 日语 | `ja-JP` | - |
| 韩语 | `ko-KR` | - |
| 越语 | `vi-VN` | - |
| 泰语 | `th-TH` | - |

### 🌍 欧洲语言 (13 种)

| 语言 | 代码 | 备注 |
|------|------|------|
| 英语 | `en-US` | 美国英语 |
| 葡萄牙语 | `pt-PT` | 欧洲葡萄牙语 |
| 葡萄牙语 | `pt-BR` | 巴西葡萄牙语 |
| 法语 | `fr-FR` | - |
| 德语 | `de-DE` | - |
| 西班牙语 | `es-ES` | - |
| 意大利语 | `it-IT` | - |
| 荷兰语 | `nl-NL` | - |
| 希腊语 | `el-GR` | - |
| 捷克语 | `cs-CZ` | - |
| 丹麦语 | `da-DK` | - |
| 芬兰语 | `fi-FI` | - |
| 土耳其语 | `tr-TR` | - |

### 🏔️ 高加索和中亚语言 (5 种)

| 语言 | 代码 | 备注 |
|------|------|------|
| 亚美尼亚语 | `hy-AM` | - |
| 阿塞拜疆语 | `az-AZ` | - |
| 俄语 | `ru-RU` | - |
| 格鲁吉亚语 | `ka-GE` | - |
| 乌兹别克语 | `uz-UZ` | - |

### 🌐 巴尔干语言 (2 种)

| 语言 | 代码 | 备注 |
|------|------|------|
| 波斯尼亚语 | `bs-BA` | - |
| 保加利亚语 | `bg-BG` | - |

### 🏙️ 南亚语言 (1 种)

| 语言 | 代码 | 备注 |
|------|------|------|
| 乌尔都语 | `ur-PK` | - |

## 使用方法

### 1. 简单的语言切换

最基础的用法是通过 `locale` prop 进行语言切换：

```tsx
import { LocaleProvider, LocaleEnum } from '@hi-ui/locale-context'

function App() {
  return (
    <LocaleProvider locale={LocaleEnum.EN_US}>
      <YourApp />
    </LocaleProvider>
  )
}
```

### 2. 动态语言切换

```tsx
import React, { useState } from 'react'
import { LocaleProvider } from '@hi-ui/locale-context'

function App() {
  const [locale, setLocale] = useState('zh-CN')

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale)
    // 可选：保存到 localStorage
    localStorage.setItem('preferredLocale', newLocale)
  }

  return (
    <>
      <div>
        <button onClick={() => handleLocaleChange('zh-CN')}>中文</button>
        <button onClick={() => handleLocaleChange('en-US')}>English</button>
        <button onClick={() => handleLocaleChange('fr-FR')}>Français</button>
      </div>
      
      <LocaleProvider locale={locale}>
        <YourApp />
      </LocaleProvider>
    </>
  )
}

export default App
```

### 3. 在组件中使用翻译

```tsx
import { useLocaleContext } from '@hi-ui/locale-context'

function MyComponent() {
  const locale = useLocaleContext()

  return (
    <div>
      {/* 直接访问翻译对象 */}
      <button>{locale.modal.confirmText}</button>
      
      {/* 使用 get 方法访问嵌套属性 */}
      <p>{locale.get('table.emptyContent')}</p>
      
      {/* 使用参数替换 */}
      <span>{locale.get('weekRange', { year: 2024, week: 10 })}</span>
    </div>
  )
}
```

### 4. 获取当前语言信息

```tsx
import { useLocaleContext } from '@hi-ui/locale-context'

function LanguageInfo() {
  const { locale, get } = useLocaleContext()

  return (
    <div>
      <p>当前语言: {locale}</p>
      <p>确认按钮: {get('modal.confirmText')}</p>
    </div>
  )
}
```

## 高级功能

### 5. 注册完整的自定义语言

如果需要支持完全不同的语言，可以使用 `extends()` 方法：

```tsx
import { LocaleProvider } from '@hi-ui/locale-context'

// 定义完整的语言包
const esperantoLocale = {
  timePicker: {
    ok: 'Akcepti',
    to: '-',
    now: 'Nun',
  },
  datePicker: {
    ok: 'Akcepti',
    to: '-',
    placeholder: ['Elektu daton'],
    // ... 其他配置
  },
  // ... 所有其他必需的模块
}

// 注册语言
LocaleProvider.extends('eo', esperantoLocale)

// 使用
<LocaleProvider locale="eo">
  <App />
</LocaleProvider>
```

### 6. 使用 register() 方法注册

`register()` 是 `extends()` 的同义词，提供更清晰的意图：

```tsx
import { LocaleProvider } from '@hi-ui/locale-context'

const customLanguage = { /* ... */ }

LocaleProvider.register('custom-locale', customLanguage)
```

### 7. 合并和覆盖（推荐）

对于微调现有语言，使用 `merge()` 方法更高效：

```tsx
import { LocaleProvider } from '@hi-ui/locale-context'

// 基于英文创建英国英语变体
LocaleProvider.merge('en-US', 'en-GB', {
  modal: {
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  },
  datePicker: {
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
})

// 使用
<LocaleProvider locale="en-GB">
  <App />
</LocaleProvider>
```

### 8. 基于现有语言创建变体

```tsx
// 创建中文简体的"儿童版本"
LocaleProvider.merge('zh-CN', 'zh-CN-child', {
  modal: {
    confirmText: '好的',
    cancelText: '取消',
  },
  table: {
    emptyContent: '暂无数据哦～',
  },
})

<LocaleProvider locale="zh-CN-child">
  <App />
</LocaleProvider>
```

### 9. 使用 languages prop 传入自定义语言

如果只需要为单个 `<LocaleProvider>` 实例提供自定义语言，可以直接传入 `languages` prop：

```tsx
const customLanguages = {
  timePicker: { ok: '确定', to: '-', now: '此刻' },
  modal: { confirmText: '是的', cancelText: '否' },
  // ... 其他翻译
}

<LocaleProvider languages={customLanguages}>
  <App />
</LocaleProvider>
```

### 10. 动态加载语言包

```tsx
import { LocaleProvider } from '@hi-ui/locale-context'

async function loadAndRegisterLocale(localeCode) {
  try {
    const response = await fetch(`/api/locales/${localeCode}.json`)
    const localeData = await response.json()
    LocaleProvider.register(localeCode, localeData)
    return true
  } catch (error) {
    console.error(`Failed to load locale: ${localeCode}`, error)
    return false
  }
}

// 使用
async function initializeApp() {
  const userLocale = localStorage.getItem('preferredLocale') || 'en-US'
  
  if (!['zh-CN', 'en-US'].includes(userLocale)) {
    await loadAndRegisterLocale(userLocale)
  }
  
  // 初始化应用
  ReactDOM.render(
    <LocaleProvider locale={userLocale}>
      <App />
    </LocaleProvider>,
    document.getElementById('root')
  )
}

initializeApp()
```

## 常见场景

### 场景 1：浏览器语言自动检测

```tsx
import { LocaleProvider } from '@hi-ui/locale-context'

function getDefaultLocale() {
  const browserLang = navigator.language // 例如 'en-US'
  
  // 支持的语言列表
  const supportedLocales = [
    'zh-CN', 'en-US', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE'
  ]
  
  // 精确匹配
  if (supportedLocales.includes(browserLang)) {
    return browserLang
  }
  
  // 语言部分匹配（例如 'en-GB' -> 'en-US'）
  const langPrefix = browserLang.split('-')[0]
  const matched = supportedLocales.find(locale => locale.startsWith(langPrefix))
  
  return matched || 'en-US'
}

function App() {
  const [locale, setLocale] = useState(getDefaultLocale())
  
  return (
    <LocaleProvider locale={locale}>
      <YourApp onLocaleChange={setLocale} />
    </LocaleProvider>
  )
}
```

### 场景 2：多租户应用（不同客户不同语言）

```tsx
import { LocaleProvider } from '@hi-ui/locale-context'

interface Tenant {
  id: string
  name: string
  defaultLocale: string
  customTranslations?: Record<string, any>
}

interface AppProps {
  tenant: Tenant
}

function App({ tenant }: AppProps) {
  // 如果租户有自定义翻译，先注册
  if (tenant.customTranslations) {
    LocaleProvider.register(`tenant-${tenant.id}`, tenant.customTranslations)
  }
  
  const locale = tenant.customTranslations 
    ? `tenant-${tenant.id}` 
    : tenant.defaultLocale
  
  return (
    <LocaleProvider locale={locale}>
      <TenantApp tenantId={tenant.id} />
    </LocaleProvider>
  )
}
```

### 场景 3：在 Next.js 中使用

```tsx
// pages/_app.tsx
import { LocaleProvider } from '@hi-ui/locale-context'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const locale = (router.query.locale as string) || 'en-US'

  return (
    <LocaleProvider locale={locale}>
      <Component {...pageProps} />
    </LocaleProvider>
  )
}

export default MyApp
```

### 场景 4：在 Redux 中管理语言状态

```tsx
// redux/localeSlice.ts
import { createSlice } from '@reduxjs/toolkit'

const localeSlice = createSlice({
  name: 'locale',
  initialState: 'zh-CN',
  reducers: {
    setLocale: (state, action) => action.payload,
  },
})

export const { setLocale } = localeSlice.actions
export default localeSlice.reducer

// App.tsx
import { useSelector, useDispatch } from 'react-redux'
import { setLocale } from './redux/localeSlice'
import { LocaleProvider } from '@hi-ui/locale-context'

function App() {
  const locale = useSelector(state => state.locale)
  const dispatch = useDispatch()

  const handleChangeLocale = (newLocale) => {
    dispatch(setLocale(newLocale))
  }

  return (
    <LocaleProvider locale={locale}>
      <YourApp onLocaleChange={handleChangeLocale} />
    </LocaleProvider>
  )
}
```

## 常见问题

### Q: 如何添加完全不同的语言?
A: 使用 `LocaleProvider.extends()` 或 `LocaleProvider.register()` 方法注册完整的语言包。确保包含所有必需的模块（timePicker, datePicker, modal, 等等）。

### Q: 如何为特定地区微调语言?
A: 使用 `LocaleProvider.merge()` 方法。这样无需定义完整的语言包，只需覆盖需要修改的部分。

### Q: 如何在运行时切换语言？
A: 使用 React 的 state 管理 locale，然后传给 `<LocaleProvider locale={locale}>`。

### Q: 翻译文本中如何使用参数？
A: 在翻译文本中使用 `{{paramName}}` 占位符，然后使用 `locale.get('key', { paramName: value })` 访问。

例如：
```tsx
// 在语言包中
weekRange: '{{year}}-W{{week}}'

// 在组件中
const result = locale.get('datePicker.weekRange', { 
  year: 2024, 
  week: 10 
})
// 结果: '2024-W10'
```

### Q: 如何确保自定义语言包的完整性？
A: 总是基于现有的内置语言进行 `merge()` 或 `extends()`，确保包含所有必需的翻译键。

### Q: 支持的最大语言数量是多少？
A: 理论上没有限制。系统可以处理任意数量的自定义语言。

### Q: 如何将语言偏好持久化到 localStorage？
A: 在语言改变时保存到 localStorage，应用加载时从中恢复：
```tsx
const savedLocale = localStorage.getItem('preferredLocale') || 'en-US'
<LocaleProvider locale={savedLocale}>
  ...
</LocaleProvider>
```

## 最佳实践

1. ✅ 始终使用内置的 `LocaleEnum` 来避免拼写错误
2. ✅ 对于地区变体使用 `merge()` 而不是 `extends()`
3. ✅ 在应用启动时一次性注册自定义语言
4. ✅ 使用 `useLocaleContext()` hook 在组件中获取翻译
5. ✅ 为用户提供有意义的语言名称（不仅是代码）
6. ✅ 保存用户的语言偏好到 localStorage 或数据库
7. ✅ 对于服务端渲染，确保初始化时使用正确的 locale

## 获取帮助

如有问题或需要技术支持，请查阅：
- [主 README](./README.md)
- [源代码](./src/)
- [测试用例](./__tests__/)
