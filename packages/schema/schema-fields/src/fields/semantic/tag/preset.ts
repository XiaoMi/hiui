/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import {  type TagProps } from '@hi-ui/tag'

export type ColorPreset = {
  back: TagProps['background']
  fore: TagProps['color']
}

// 内部的的标签颜色规范 // TODO 待确认后更新
export const colorPreset = {
  blue: { back: '#EDF7FE', fore: '#0744AD' },
  yellow: { back: '#FEFCE9', fore: '#875100' },
  green: { back: '#EEFEF2', fore: '#007D3E' },
  red: { back: '#FEF1EE', fore: '#B32D36' },
  orange: { back: '#FEF5EE', fore: '#B23E1B' },
  purple: { back: '#F5EEFE', fore: '#533DAD' },
  /** 蓝绿色 */ cyan: { back: '#ECFEFC', fore: '#0C737A' },
  /** 天蓝色 */ skyblue: { back: '#ECFCFE', fore: '#006BB3' },
  /** 深紫色 */ darkPurple: { back: '#EEF2FE', fore: '#363AB3' },
  /** 蓝灰色 */ blueGray: { back: '#EEF7FE', fore: '#3C5485' },
  /** 中灰色 */ midGray: { back: '#F2F4F7', fore: '#1F2733' },
// eslint-disable-next-line prettier/prettier
} satisfies Record<string, ColorPreset>

// 边框色 DFE2E8 0.5px

export type BuiltinColorEnum = Required<TagProps>['type']

export type SCMColorEnumPreset = keyof typeof colorPreset

export const ColorEnumPreset = Object.keys(colorPreset) as SCMColorEnumPreset[]
