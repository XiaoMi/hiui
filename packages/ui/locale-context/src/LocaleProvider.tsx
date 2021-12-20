import React from 'react'
import { ValueOf } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { LocaleContext } from './LocaleContext'
import localeMap from './locale'

/**
 * TODO: What is LocaleContext
 */
export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children, locale }) => {
  return (
    <LocaleContext.Provider
      value={{
        ...localeMap[locale],
        locale,
      }}
    >
      {children}
    </LocaleContext.Provider>
  )
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
