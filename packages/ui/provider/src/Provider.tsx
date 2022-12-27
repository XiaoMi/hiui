import React, { useEffect } from 'react'
import { __DEV__ } from '@hi-ui/env'
import { LocaleProvider, LocaleProviderProps } from '@hi-ui/core'
import { DesignSystemAccentColorEnum, DesignSystemProps } from './types'
import { createSystem, extendsTheme } from './theme'
import { getAccentColorTheme } from './accent-color'

const PREFIX = 'hi-v4'

/**
 * TODO: What is Provider
 */
export const Provider: React.FC<ProviderProps> & { extends: ProviderExtendsFunc } = ({
  children,
  locale,
  languages,
  accentColor,
  theme,
}) => {
  /**
   * global css var config
   */
  useEffect(() => {
    const accentColorTheme = getAccentColorTheme(accentColor)

    const mergedThemes = extendsTheme(accentColorTheme, theme)

    if (!mergedThemes) return

    createSystem(mergedThemes, PREFIX)
    return () => {
      createSystem(null, PREFIX)
    }
  }, [accentColor, theme])

  return (
    <LocaleProvider locale={locale} languages={languages}>
      {children}
    </LocaleProvider>
  )
}

export interface ProviderProps extends LocaleProviderProps, ThemeProviderProps {}

interface ThemeProviderProps {
  /**
   * 内置主题强调色，共 8 种色系选择
   */
  accentColor?: DesignSystemAccentColorEnum
  /**
   * 自定义主题，包括色彩、圆角、边框、动效等
   */
  theme?: DesignSystemProps
}

if (__DEV__) {
  Provider.displayName = 'Provider'
}

Provider.extends = LocaleProvider.extends

type ProviderExtendsFunc = typeof LocaleProvider.extends
