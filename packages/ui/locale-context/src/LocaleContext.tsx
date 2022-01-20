import { createContext, useContext } from 'react'
import { Locale } from './locale/interface'
import defaultLocale from './locale/zh-CN'
import { LocaleEnum } from './LocaleProvider'
import { getNested } from '@hi-ui/func-utils'

interface UseLocaleContext extends Locale {
  get: (key: string, data?: Record<string, string>) => string
  locale: LocaleEnum
}

// 1. 赋予动态能力，获取 国际化文案值
// 2. 查找异常拦截，进行报错提示
export const getLanguage = (languageData: Record<string, any>) => (key: string, data?: any) => {
  let value: any = getNested(languageData, key.split('.'))

  if (typeof value !== 'string') {
    throw new Error(`HiUI : The ${key} in language package is missing.`)
  }

  if (data) {
    Object.keys(data).forEach((key) => {
      value = value.replace(`{{${key}}}`, data[key])
    })
  }

  return value
}

export const LocaleContext = createContext<UseLocaleContext>({
  ...defaultLocale,
  locale: LocaleEnum['zh-CN'],
  get: getLanguage(defaultLocale),
})

export const useLocaleContext = () => {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error(
      'The locale context should be wrapped by <LocaleContext locale={locale} /> in App.'
    )
  }

  return context
}
