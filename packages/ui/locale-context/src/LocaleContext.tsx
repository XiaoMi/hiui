import { createContext, useContext } from 'react'
import { Locale } from './locale/interface'
import defaultLocale from './locale/zh-CN'
import { LocaleEnum } from './LocaleProvider'

interface UseLocaleContext extends Locale {
  get: (key: string, data?: Record<string, string>) => string
  locale: LocaleEnum
}

export const LocaleContext = createContext<UseLocaleContext>({
  ...defaultLocale,
  locale: LocaleEnum['zh-CN'],
  get: () => '',
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
