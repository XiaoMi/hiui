import React, { useMemo, useCallback } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { LocaleContext } from './LocaleContext'
import localeMap from './locale'

const DEFAULT_LOCALE = 'zh-CN'

/**
 * TODO: What is LocaleContext
 */
export const LocaleProvider: React.FC<LocaleProviderProps> = ({
  children,
  locale = DEFAULT_LOCALE,
}) => {
  // 1. 赋予动态能力，获取 国际化文案值
  // 2. 查找异常拦截，进行报错提示
  const get = useCallback(
    (key: string, data?: any) => {
      const languageData: any = localeMap[locale]

      if (!languageData) {
        throw new Error(`HiUI: The ${locale} language package is missing.`)
      }

      // TODO: using get 支持嵌套
      // const value = getObject()
      let value = languageData[key]

      if (typeof value !== 'string') {
        throw new Error(`HiUI : The ${key} in ${locale} language package is missing.`)
      }

      if (data) {
        Object.keys(data).forEach((key) => {
          value = value.replace(`{{${key}}}`, data[key])
        })
      }

      return value
    },
    [locale]
  )

  const providedValue = useMemo(() => {
    return { ...localeMap[locale], get }
  }, [locale, get])

  return <LocaleContext.Provider value={providedValue}>{children}</LocaleContext.Provider>
}

export interface LocaleProviderProps {
  /**
   * 组件默认的选择器类
   */
  locale: 'zh-CN' | 'en-US' | 'zh-HK' | 'zh-TW'
}

if (__DEV__) {
  LocaleProvider.displayName = 'LocaleProvider'
}
