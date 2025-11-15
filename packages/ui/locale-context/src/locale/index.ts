import zhCN from './zh-CN'
import enUS from './en-US'
import zhHK from './zh-HK'
import zhTW from './zh-TW'
import { LocaleLanguage } from '../types'

export const BUILT_IN_LOCALES: Record<string, LocaleLanguage> = {
  'zh-CN': zhCN,
  'zh-Hans': zhCN,
  'en-US': enUS,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
}

export default BUILT_IN_LOCALES
