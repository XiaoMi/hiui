import React, { useMemo } from 'react'
import { invariant, __DEV__ } from '@hi-ui/env'
import { LocaleContext, getLanguage } from './LocaleContext'
import localeMap from './locale'
import { LocaleEnum, LocaleLanguage } from './types'

const DEFAULT_LOCALE = 'zh-CN'

/**
 * TODO: What is LocaleContext
 */
export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  locale = DEFAULT_LOCALE,
}) => {
  const get = useMemo(() => {
    let languageData: LocaleLanguage = localeMap[locale]

    if (!languageData) {
      invariant(
        false,
        `Will use ${DEFAULT_LOCALE} as default locale because of the ${locale} language package is missing.`
      )

      languageData = localeMap[DEFAULT_LOCALE]
    }

    return getLanguage(languageData)
  }, [locale])

  const providedValue = useMemo(() => {
    return {
      ...localeMap[locale],
      get,
      locale,
    }
  }, [locale, get])

  return <LocaleContext.Provider value={providedValue}>{children}</LocaleContext.Provider>
}

export interface LocaleProviderProps {
  /**
   * 组件默认的选择器类
   */
  locale: LocaleEnum
}

if (__DEV__) {
  LocaleProvider.displayName = 'LocaleProvider'
}
