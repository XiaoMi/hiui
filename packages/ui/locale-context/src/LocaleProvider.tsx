import React, { useMemo } from 'react'
import { invariant, __DEV__ } from '@hi-ui/env'
import { LocaleContext, getLanguage } from './LocaleContext'
import localeMap from './locale'
import { LocaleEnum, LocaleLanguage } from './types'

const DEFAULT_LOCALE = 'zh-CN'

// 自定义语言包注册表
const USER_LANGUAGES_TABLES = {} as Record<string, LocaleLanguage>

export const LocaleProvider: React.FC<LocaleProviderProps> & {
  extends: LocaleExtendsFunc
  register: LocaleRegisterFunc
  merge: LocaleMergeFunc
} = ({ children, locale = DEFAULT_LOCALE, languages }) => {
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
  children?: React.ReactNode
}

if (__DEV__) {
  LocaleProvider.displayName = 'LocaleProvider'
}

/**
 * 使用完整的自定义语言包扩展国际化
 * @param locale - 地区标识
 * @param languages - 完整的语言包对象
 *
 * @example
 * ```tsx
 * LocaleProvider.extends('pt-BR', {
 *   timePicker: { ok: 'OK', to: '-', now: 'Agora' },
 *   // ... 其他翻译
 * })
 * ```
 */
const extendsLanguage = (locale: string, languages?: LocaleLanguage) => {
  if (!languages) {
    delete USER_LANGUAGES_TABLES[locale]
  } else {
    USER_LANGUAGES_TABLES[locale] = languages
  }
}

/**
 * 注册新的语言包
 * @param locale - 地区标识
 * @param languages - 完整的语言包对象
 *
 * @example
 * ```tsx
 * LocaleProvider.register('my-LOCALE', customLanguagePackage)
 * ```
 */
const registerLanguage = (locale: string, languages: LocaleLanguage) => {
  USER_LANGUAGES_TABLES[locale] = languages
}

/**
 * 合并默认语言包和自定义翻译
 * 支持基于现有的内置语言包进行部分覆盖
 * @param baseLocale - 基础语言（如 'en-US'）
 * @param customLocale - 自定义地区标识
 * @param overrides - 要覆盖的翻译对象（支持深度覆盖）
 *
 * @example
 * ```tsx
 * LocaleProvider.merge('en-US', 'en-GB', {
 *   modal: { confirmText: 'Confirm', cancelText: 'Cancel' }
 * })
 * ```
 */
const mergeLanguage = (
  baseLocale: string,
  customLocale: string,
  overrides: Partial<LocaleLanguage>
) => {
  const baseLanguage = localeMap[baseLocale] || localeMap[DEFAULT_LOCALE]

  if (!baseLanguage) {
    invariant(false, `Base locale "${baseLocale}" is not found`)
    return
  }

  // 深度合并
  const merged = deepMerge(baseLanguage, overrides)
  USER_LANGUAGES_TABLES[customLocale] = merged
}

/**
 * 深度合并对象
 */
function deepMerge(target: any, source: any): any {
  const result = { ...target }

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key]
      const targetValue = result[key]

      if (
        sourceValue !== null &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue !== null &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        result[key] = deepMerge(targetValue, sourceValue)
      } else {
        result[key] = sourceValue
      }
    }
  }

  return result
}

export type LocaleExtendsFunc = typeof extendsLanguage
export type LocaleRegisterFunc = typeof registerLanguage
export type LocaleMergeFunc = typeof mergeLanguage

LocaleProvider.extends = extendsLanguage
LocaleProvider.register = registerLanguage
LocaleProvider.merge = mergeLanguage
