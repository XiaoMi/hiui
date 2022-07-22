import React, { useMemo } from 'react'
import { invariant, __DEV__ } from '@hi-ui/env'
import { LocaleContext, getLanguage } from './LocaleContext'
import localeMap from './locale'
import { LocaleEnum, LocaleLanguage } from './types'

const DEFAULT_LOCALE = 'zh-CN'

// 自定义语言包注册表
const USER_LANGUAGES_TABLES = {} as Record<string, LocaleLanguage>

/**
 * TODO: What is LocaleContext
 */
export const LocaleProvider: React.FC<LocaleProviderProps> & { extends: LocaleExtendsFunc } = ({
  children,
  locale = DEFAULT_LOCALE,
  languages,
}) => {
  const get = useMemo(() => {
    let languageData: LocaleLanguage =
      typeof languages === 'object' ? languages : USER_LANGUAGES_TABLES[locale] || localeMap[locale]

    if (!languageData) {
      invariant(
        false,
        `Will use ${DEFAULT_LOCALE} as default locale because of the ${locale} language package is missing.`
      )

      languageData = localeMap[DEFAULT_LOCALE]
    }

    return getLanguage(languageData)
  }, [locale, languages])

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
   * 设置国际化 locale 地区标识
   */
  locale?: LocaleEnum
  /**
   * 自定义语言包，将忽略内置语言包 locale 字段
   */
  languages?: LocaleLanguage
}

if (__DEV__) {
  LocaleProvider.displayName = 'LocaleProvider'
}

const extendsLanguage = (locale: string, languages?: LocaleLanguage) => {
  if (!languages) {
    delete USER_LANGUAGES_TABLES[locale]
  } else {
    USER_LANGUAGES_TABLES[locale] = languages
  }
}

export type LocaleExtendsFunc = typeof extendsLanguage

LocaleProvider.extends = extendsLanguage
