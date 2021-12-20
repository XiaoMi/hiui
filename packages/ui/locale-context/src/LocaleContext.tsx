import { createContext } from 'react'
import { Locale } from './locale/interface'
import defaultLocale from './locale/zh-CN'
import { LocaleEnum } from './LocaleProvider'

export const LocaleContext = createContext<Locale & { locale: LocaleEnum }>({
  ...defaultLocale,
  locale: LocaleEnum['zh-CN'],
})
