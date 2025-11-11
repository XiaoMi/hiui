export interface LocaleLanguage {
  timePicker: Record<string, any>
  datePicker: Record<string, any>
  pagination: Record<string, any>
  cascader: Record<string, any>
  checkCascader: Record<string, any>
  select: Record<string, any>
  selectTree: Record<string, any>
  search: Record<string, any>
  transfer: Record<string, any>
  upload: Record<string, any>
  modal: Record<string, any>
  tabs: Record<string, any>
  timeline: Record<string, any>
  form: Record<string, any>
  tree: Record<string, any>
  table: Record<string, any>
  watermark: Record<string, any>
  emptyState: Record<string, any>
  checkSelect: Record<string, any>
  treeSelect: Record<string, any>
  checkTreeSelect: Record<string, any>
  picker: Record<string, any>
  zenMode: Record<string, any>
  popConfirm: Record<string, any>
  tag: Record<string, any>
  backTop: Record<string, any>
}

export const LocaleEnum = {
  ZH_CN: 'zh-CN',
  ZH_HANS: 'zh-Hans',
  EN_US: 'en-US',
  ZH_HK: 'zh-HK',
  ZH_TW: 'zh-TW',
  TH_TH: 'th-TH',
  // European languages
  PT_PT: 'pt-PT',
  PT_BR: 'pt-BR',
  FR_FR: 'fr-FR',
  DE_DE: 'de-DE',
  ES_ES: 'es-ES',
  IT_IT: 'it-IT',
  NL_NL: 'nl-NL',
  EL_GR: 'el-GR',
  CS_CZ: 'cs-CZ',
  DA_DK: 'da-DK',
  FI_FI: 'fi-FI',
  TR_TR: 'tr-TR',
  // Asian languages
  JA_JP: 'ja-JP',
  KO_KR: 'ko-KR',
  VI_VN: 'vi-VN',
  // Caucasian & Central Asian languages
  HY_AM: 'hy-AM',
  AZ_AZ: 'az-AZ',
  RU_RU: 'ru-RU',
  KA_GE: 'ka-GE',
  UZ_UZ: 'uz-UZ',
  // Balkan languages
  BS_BA: 'bs-BA',
  BG_BG: 'bg-BG',
  // South Asian languages
  UR_PK: 'ur-PK',
} as const

type ValueOf<T> = T[keyof T]

// 对外暴露同名联合类型
// eslint-disable-next-line no-redeclare
export type LocaleEnum = ValueOf<typeof LocaleEnum>
