import React, { useEffect } from 'react'
import { __DEV__ } from '@hi-ui/env'
import {
  PortalProvider,
  PortalProviderProps,
  LocaleProvider,
  LocaleProviderProps,
  GlobalProvider,
  UseGlobalContext,
  GlobalConfig,
} from '@hi-ui/core'
import { DesignSystemAccentColorEnum, ThemeDataProps } from './types'
import {
  createComponentsSystem,
  createSystem,
  extendsTheme,
  removeComponentsSystem,
  removeSystem,
} from './theme'
import { getAccentColorTheme } from './accent-color'

const PREFIX = 'hi-v5'

export const Provider: React.FC<ProviderProps> & {
  extends: ProviderExtendsFunc
  merge: ProviderMergeFunc
  config: ProviderConfigFunc
} = ({ children, locale, languages, accentColor, theme, portal, prefixCls, ...rest }) => {
  const prefix = GlobalConfig.prefixCls || PREFIX

  /**
   * global css var config
   */
  useEffect(() => {
    const accentColorTheme = getAccentColorTheme(accentColor)

    const mergedThemes = extendsTheme(accentColorTheme, theme?.token)
    const componentsThemes = theme?.components

    if (!mergedThemes && !componentsThemes) return

    requestAnimationFrame(() => {
      createSystem(mergedThemes, prefix)
      createComponentsSystem(componentsThemes, prefix)
    })

    return () => {
      removeSystem(prefix)
      removeComponentsSystem(componentsThemes, prefix)
    }
  }, [accentColor, prefix, theme])

  return (
    <PortalProvider portal={portal}>
      <LocaleProvider locale={locale} languages={languages}>
        <GlobalProvider value={{ ...rest, prefixCls }}>{children}</GlobalProvider>
      </LocaleProvider>
    </PortalProvider>
  )
}

export interface ProviderProps
  extends LocaleProviderProps,
    PortalProviderProps,
    UseGlobalContext,
    ThemeProviderProps {
  children?: React.ReactNode
}

interface ThemeProviderProps {
  /**
   * 内置主题强调色，共 8 种色系选择
   */
  accentColor?: DesignSystemAccentColorEnum
  /**
   * 自定义主题，包括色彩、圆角、边框、动效等
   */
  theme?: ThemeDataProps
}

if (__DEV__) {
  Provider.displayName = 'Provider'
}

/**
 * 从 LocaleProvider 导出的方法
 */
Provider.extends = LocaleProvider.extends
Provider.merge = LocaleProvider.merge

type ProviderExtendsFunc = typeof LocaleProvider.extends
type ProviderMergeFunc = typeof LocaleProvider.merge
type ProviderConfigFunc = (config: { prefixCls: string }) => void

Provider.config = ({ prefixCls }: { prefixCls: string }) => {
  GlobalConfig.prefixCls = prefixCls
}
