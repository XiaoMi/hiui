import { DesignSystemAccentColorEnum, DesignSystemColorProps } from './types'

export const DEFAULT_ACCENT_COLOR_THEME = {
  [DesignSystemAccentColorEnum.BRANDBLUE]: {
    50: '#edf2ff',
    100: '#e5ecff',
    200: '#b1cafc',
    300: '#74a2ff',
    400: '#4d82ff',
    500: '#2660ff',
    600: '#1843d2',
    700: '#0c2ba6',
    800: '#051879',
    900: '#000a4d',
  },
  [DesignSystemAccentColorEnum.SKYBLUE]: {
    50: '#e8fbff',
    100: '#cff4fc',
    200: '#8fe5ff',
    300: '#63d5ff',
    400: '#36c3ff',
    500: '#0aadff',
    600: '#0688d2',
    700: '#0365a6',
    800: '#014579',
    900: '#00294d',
  },
  [DesignSystemAccentColorEnum.ULTRAMARINE]: {
    50: '#e8ecff',
    100: '#d2d7fa',
    200: '#a3abf5',
    300: '#838af0',
    400: '#6368eb',
    500: '#4545e6',
    600: '#302bc0',
    700: '#201799',
    800: '#130973',
    900: '#0a004d',
  },
  [DesignSystemAccentColorEnum.PURPLE]: {
    50: '#f4e8ff',
    100: '#e5d4fc',
    200: '#cba2fa',
    300: '#b37ff7',
    400: '#9a5ef5',
    500: '#7f3df2',
    600: '#5c26c9',
    700: '#3e149f',
    800: '#250776',
    900: '#12004d',
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
    50: '#e8fff8',
    100: '#c7f3ec',
    200: '#80e7d0',
    300: '#52dac1',
    400: '#29ceb5',
    500: '#04c2ac',
    600: '#03a597',
    700: '#018781',
    800: '#016a68',
    900: '#004b4d',
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
    50: '#fff6e8',
    100: '#fff0db',
    200: '#ffcd8b',
    300: '#ffb35d',
    400: '#ff972e',
    500: '#f70',
    600: '#d25b00',
    700: '#a64200',
    800: '#792c00',
    900: '#4d1900',
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
