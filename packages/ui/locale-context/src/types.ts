import { ValueOf } from '@hi-ui/core'

export interface LocaleLanguage {
  table: Record<string, any>
  tree: Record<string, any>
  form: Record<string, any>
  timeline: Record<string, any>
  tabs: Record<string, any>
  watermark: Record<string, any>
  datePicker: Record<string, any>
  pagination: Record<string, any>
  cascader: Record<string, any>
  select: Record<string, any>
  selectTree: Record<string, any>
  search: Record<string, any>
  transfer: Record<string, any>
  upload: Record<string, any>
  modal: Record<string, any>
}

export const LocaleEnum = {
  ZH_CN: 'zh-CN',
  ZH_HANS: 'zh-Hans',
  EN_US: 'en-US',
  ZH_HK: 'zh-HK',
  ZH_TW: 'zh-TW',
} as const

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type LocaleEnum = ValueOf<typeof LocaleEnum>
