import * as CSS from 'csstype'
import { ValueOf } from '@hi-ui/core'

export const DesignSystemAccentColorEnum = {
  /**
   * 品牌蓝
   */
  BRANDBLUE: 'brandblue',
  /**
   * 深蓝
   */
  ULTRAMARINE: 'ultramarine',
  /**
   * 浅蓝
   */
  PASTELBLUE: 'pastelblue',
  /**
   * 天空蓝
   */
  SKYBLUE: 'skyblue',
  /**
   * 活力橙
   */
  ORANGE: 'orange',
  /**
   * 琥珀
   */
  AMBER: 'amber',
  /**
   * 紫罗兰
   */
  PURPLE: 'purple',
  /**
   * 橘青
   */
  CYAN: 'cyan',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type DesignSystemAccentColorEnum = ValueOf<typeof DesignSystemAccentColorEnum>

export interface DesignSystemProps {
  color?: {
    primary?: DesignSystemColorProps
    success?: DesignSystemColorProps
    warning?: DesignSystemColorProps
    danger?: DesignSystemColorProps
    gray?: DesignSystemColorProps
  }
  spacing?: DesignSystemSpacingProps
  zindex?: DesignSystemZindexProps
  shadow?: DesignSystemShadowProps
  height?: DesignSystemHeightProps
  border?: {
    size?: DesignSystemBorderSizeProps
    radius?: DesignSystemBorderRadiusProps
  }
  motion?: {
    duration?: DesignSystemMotionDurationProps
    bezier?: DesignSystemMotionBezierProps
  }
  text?: {
    size?: DesignSystemTextSizeProps
    weight?: DesignSystemTextWeightProps
    spacing?: DesignSystemTextSpacingProps
    lineheight?: DesignSystemTextLineheightProps
  }
}

export interface DesignSystemColorProps {
  50?: CSS.Property.Color
  100?: CSS.Property.Color
  200?: CSS.Property.Color
  300?: CSS.Property.Color
  400?: CSS.Property.Color
  500?: CSS.Property.Color
  600?: CSS.Property.Color
  700?: CSS.Property.Color
  800?: CSS.Property.Color
  900?: CSS.Property.Color
}

export interface DesignSystemSpacingProps {
  1?: string
  2?: string
  3?: string
  4?: string
  5?: string
  6?: string
  7?: string
  8?: string
  9?: string
  10?: string
  11?: string
  12?: string
  13?: string
  14?: string
  15?: string
  16?: string
  17?: string
  18?: string
  19?: string
  20?: string
}

export interface DesignSystemZindexProps {
  back?: number
  auto?: 'auto'
  normal?: number
  absolute?: number
  sticky?: number
  drawer?: number
  modal?: number
  dialog?: number
  toast?: number
  popper?: number
  overlay?: number
  tooltip?: number
  watermark?: number
  top?: number
}

export interface DesignSystemShadowProps {
  none?: 'none'
  xs?: string
  sm?: string
  md?: string
  lg?: string
}

export interface DesignSystemBorderSizeProps {
  none?: 0 | 'none'
  // 形如：'1px solid'
  normal?: string
  semibold?: string
  bold?: string
}

export interface DesignSystemBorderRadiusProps {
  none?: CSS.Property.BorderRadius
  sm?: CSS.Property.BorderRadius
  md?: CSS.Property.BorderRadius
  lg?: CSS.Property.BorderRadius
  full?: CSS.Property.BorderRadius
}

export interface DesignSystemHeightProps {
  1: CSS.Property.Height
  2: CSS.Property.Height
  3: CSS.Property.Height
  4: CSS.Property.Height
  5: CSS.Property.Height
  6: CSS.Property.Height
  7: CSS.Property.Height
  8: CSS.Property.Height
  9: CSS.Property.Height
  10: CSS.Property.Height
  11: CSS.Property.Height
  12: CSS.Property.Height
  13: CSS.Property.Height
  14: CSS.Property.Height
  15: CSS.Property.Height
  16: CSS.Property.Height
}

export interface DesignSystemMotionDurationProps {
  none: CSS.Property.TransitionDuration
  fast: CSS.Property.TransitionDuration
  normal: CSS.Property.TransitionDuration
  slow: CSS.Property.TransitionDuration
  // slower: CSS.Property.TransitionDuration
}

export interface DesignSystemMotionBezierProps {
  none: CSS.Property.TransitionTimingFunction
  easing: CSS.Property.TransitionTimingFunction
  'ease-in': CSS.Property.TransitionTimingFunction
  'ease-out': CSS.Property.TransitionTimingFunction
  'ease-in-out': CSS.Property.TransitionTimingFunction
}

export interface DesignSystemTextSizeProps {
  xxl: CSS.Property.FontSize
  xl: CSS.Property.FontSize
  lg: CSS.Property.FontSize
  md: CSS.Property.FontSize
  sm: CSS.Property.FontSize
}

export interface DesignSystemTextLineheightProps {
  xxl: CSS.Property.LineHeight
  xl: CSS.Property.LineHeight
  lg: CSS.Property.LineHeight
  md: CSS.Property.LineHeight
  sm: CSS.Property.LineHeight
}

export interface DesignSystemTextWeightProps {
  thin: CSS.Property.FontWeight
  extralight: CSS.Property.FontWeight
  light: CSS.Property.FontWeight
  normal: CSS.Property.FontWeight
  medium: CSS.Property.FontWeight
  semibold: CSS.Property.FontWeight
  bold: CSS.Property.FontWeight
  extrabold: CSS.Property.FontWeight
  black: CSS.Property.FontWeight
}

export interface DesignSystemTextSpacingProps {
  tighter: CSS.Property.LetterSpacing
  tight: CSS.Property.LetterSpacing
  normal: CSS.Property.LetterSpacing
  wide: CSS.Property.LetterSpacing
  wider: CSS.Property.LetterSpacing
  widest: CSS.Property.LetterSpacing
}
