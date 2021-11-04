import { createContext } from 'react'
import { Locale } from './locale/interface'
import defaultLocale from './locale/zh-CN'

export const LocaleContext = createContext<Locale>(defaultLocale)
