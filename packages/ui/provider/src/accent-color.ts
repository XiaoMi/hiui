import { DesignSystemAccentColorEnum, DesignSystemColorProps } from './types'

export const DEFAULT_ACCENT_COLOR_THEME = {
  [DesignSystemAccentColorEnum.BRANDBLUE]: {
    50: '#e2f3fe',
    100: '#bde2ff',
    200: '#96ceff',
    300: '#70b8ff',
    400: '#4a9eff',
    500: '#237ffa',
    600: '#1360d4',
    700: '#0744ad',
    800: '#002d87',
    900: '#001d61',
  },
  [DesignSystemAccentColorEnum.SKYBLUE]: {
    50: '#e5fafe',
    100: '#b9f0fe',
    200: '#8ee4fe',
    300: '#63d5fe',
    400: '#38c3fe',
    500: '#0daeff',
    600: '#0089d9',
    700: '#006bb3',
    800: '#004f8c',
    900: '#003666',
  },
  [DesignSystemAccentColorEnum.ULTRAMARINE]: {
    50: '#e5ebfe',
    100: '#ccd8ff',
    200: '#b3c2ff',
    300: '#9af',
    400: '#8090ff',
    500: '#6372ff',
    600: '#4c55d9',
    700: '#363ab3',
    800: '#23238c',
    900: '#171466',
  },
  [DesignSystemAccentColorEnum.PURPLE]: {
    50: '#f0e5fe',
    100: '#e1cefe',
    200: '#d1b7fe',
    300: '#bfa0fe',
    400: '#a889fe',
    500: '#9772fb',
    600: '#7255d4',
    700: '#533dad',
    800: '#382987',
    900: '#221861',
  },
  [DesignSystemAccentColorEnum.PASTELBLUE]: {
    50: '#e5f3fe',
    100: '#d4ebff',
    200: '#bcdaf7',
    300: '#a2c4eb',
    400: '#8aaede',
    500: '#7298d0',
    600: '#5575ab',
    700: '#3c5485',
    800: '#26375e',
    900: '#141d38',
  },
  [DesignSystemAccentColorEnum.CYAN]: {
    50: '#e5fefa',
    100: '#befaf2',
    200: '#93ede4',
    300: '#6ce0d9',
    400: '#48d4cf',
    500: '#28c7c7',
    600: '#189ca1',
    700: '#0c737a',
    800: '#044c54',
    900: '#00282e',
  },
  [DesignSystemAccentColorEnum.AMBER]: {
    50: '#fefee5',
    100: '#fefbb9',
    200: '#fef58e',
    300: '#feec63',
    400: '#fec938',
    500: '#face0c',
    600: '#d4a600',
    700: '#ad8200',
    800: '#876100',
    900: '#614200',
  },
  [DesignSystemAccentColorEnum.ORANGE]: {
    50: '#fef0e5',
    100: '#feddc4',
    200: '#fec7a3',
    300: '#feaf82',
    400: '#fe9561',
    500: '#fe7940',
    600: '#d95a2b',
    700: '#b33e1b',
    800: '#8c270e',
    900: '#661505',
  },
} as Record<string, DesignSystemColorProps>

const EXTENDS_ACCENT_COLOR_THEME_REF = {
  current: { ...DEFAULT_ACCENT_COLOR_THEME },
}

export const getAccentColorTheme = (accentColor: string | undefined) => {
  if (!accentColor) return

  const props = EXTENDS_ACCENT_COLOR_THEME_REF.current[accentColor]

  if (props) {
    return { color: { primary: props } }
  }
}

export const extendsAccentColorTheme = (name: string, props: DesignSystemColorProps) => {
  EXTENDS_ACCENT_COLOR_THEME_REF.current[name] = props
}
