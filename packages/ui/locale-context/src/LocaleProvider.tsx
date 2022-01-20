import React, { useMemo } from 'react'
import { ValueOf } from '@hi-ui/core'
import { invariant, __DEV__ } from '@hi-ui/env'
import { LocaleContext, getLanguage } from './LocaleContext'
import localeMap from './locale'

const DEFAULT_LOCALE = 'zh-CN'

/**
 * TODO: What is LocaleContext
 */
export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  locale = DEFAULT_LOCALE,
}) => {
  const get = useMemo(() => {
    let languageData: any = localeMap[locale]

    if (!languageData) {
      invariant(
        true,
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

export const LocaleEnum = {
  'zh-CN': 'zh-CN',
  'en-US': 'en-US',
  'zh-HK': 'zh-HK',
  'zh-TW': 'zh-TW',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type LocaleEnum = ValueOf<typeof LocaleEnum>

export interface LocaleProviderProps {
  /**
   * 组件默认的选择器类
   */
  locale: LocaleEnum
}

if (__DEV__) {
  LocaleProvider.displayName = 'LocaleProvider'
}
