import { createContext, useContext } from 'react'
import { LocaleLanguage, LocaleEnum } from './types'
import defaultLocale from './locale/zh-CN'
import { getNested } from '@hi-ui/object-utils'
import { invariant } from '@hi-ui/env'
import { isNullish } from '@hi-ui/type-assertion'

// 1. 赋予动态能力，获取 国际化文案值
// 2. 查找异常拦截，进行报错提示
export const getLanguage = (languageData: LocaleLanguage) => (key: string, data?: any) => {
  let value: any = getNested(languageData, key.split('.'))

  invariant(!isNullish(value), `The ${key} in language package is missing.`)

  if (data) {
    Object.keys(data).forEach((key) => {
      value = value.replace(`{{${key}}}`, data[key])
    })
  }

  return value
}

export const LocaleContext = createContext<UseLocaleContext>({
  ...defaultLocale,
  locale: LocaleEnum.ZH_CN,
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

export interface UseLocaleContext extends LocaleLanguage {
  get: (key: string, data?: Record<string, string | number>) => string
  locale: LocaleEnum
}
