import React from 'react'
import { __DEV__ } from '@hi-ui/env'
import { LocaleContext } from './LocaleContext'
import localeMap from './locale'

/**
 * TODO: What is LocaleContext
 */
export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children, locale }) => {
  return <LocaleContext.Provider value={localeMap[locale]}>{children}</LocaleContext.Provider>
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
