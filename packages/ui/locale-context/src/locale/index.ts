import zhCN from './zh-CN'
import enUS from './en-US'
import zhHK from './zh-HK'
import zhTW from './zh-TW'
import thTH from './th-TH'
// European languages
import ptPT from './pt-PT'
import ptBR from './pt-BR'
import frFR from './fr-FR'
import deDe from './de-DE'
import esES from './es-ES'
import itIT from './it-IT'
import nlNL from './nl-NL'
import elGR from './el-GR'
import csCZ from './cs-CZ'
import daDK from './da-DK'
import fiFI from './fi-FI'
import trTR from './tr-TR'
// Asian languages
import jaJP from './ja-JP'
import koKR from './ko-KR'
import viVN from './vi-VN'
// Caucasian & Central Asian languages
import hyAM from './hy-AM'
import azAZ from './az-AZ'
import ruRU from './ru-RU'
import kaGE from './ka-GE'
import uzUZ from './uz-UZ'
// Balkan languages
import bsBA from './bs-BA'
import bgBG from './bg-BG'
// South Asian languages
import urPK from './ur-PK'

const localeMap: Record<string, any> = {
  'zh-CN': zhCN,
  'zh-Hans': zhCN,
  'en-US': enUS,
  'zh-HK': zhHK,
  'zh-TW': zhTW,
  'th-TH': thTH,
  // European languages
  'pt-PT': ptPT,
  'pt-BR': ptBR,
  'fr-FR': frFR,
  'de-DE': deDe,
  'es-ES': esES,
  'it-IT': itIT,
  'nl-NL': nlNL,
  'el-GR': elGR,
  'cs-CZ': csCZ,
  'da-DK': daDK,
  'fi-FI': fiFI,
  'tr-TR': trTR,
  // Asian languages
  'ja-JP': jaJP,
  'ko-KR': koKR,
  'vi-VN': viVN,
  // Caucasian & Central Asian languages
  'hy-AM': hyAM,
  'az-AZ': azAZ,
  'ru-RU': ruRU,
  'ka-GE': kaGE,
  'uz-UZ': uzUZ,
  // Balkan languages
  'bs-BA': bsBA,
  'bg-BG': bgBG,
  // South Asian languages
  'ur-PK': urPK,
}

export default localeMap
