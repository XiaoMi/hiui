import { type SupportedLocale, useTranslation } from './translation'

const LOCALE_OPTIONS: Array<{ id: SupportedLocale; nativeLabel: string }> = [
  { id: 'zh-CN', nativeLabel: '简体中文' },
  { id: 'zh-TW', nativeLabel: '繁體中文' },
  { id: 'en-US', nativeLabel: 'English' },
  { id: 'id-ID', nativeLabel: 'Bahasa Indonesia' },
  { id: 'th-TH', nativeLabel: 'ไทย' },
  { id: 'de-DE', nativeLabel: 'Deutsch' },
  { id: 'ar-SA', nativeLabel: 'العربية' },
]

const USER_CENTER_LABEL: Record<SupportedLocale, string> = {
  'zh-CN': '用户中心',
  'zh-TW': '使用者中心',
  'en-US': 'User Center',
  'id-ID': 'Pusat Pengguna',
  'th-TH': 'ศูนย์ผู้ใช้',
  'de-DE': 'Benutzerzentrum',
  'ar-SA': 'مركز المستخدم',
}

function getLanguageFieldLabel(
  locale: SupportedLocale,
  translate: (key: string) => string,
) {
  const localizedLabel = translate('语言')
  if (locale === 'en-US') return localizedLabel
  return `${localizedLabel} / Language`
}

export function useHostShellLocalization() {
  const { dir, locale, setLocale, t } = useTranslation()
  const resolvedLocale = LOCALE_OPTIONS.some((option) => option.id === locale)
    ? locale
    : 'zh-CN'

  return {
    dir,
    locale: resolvedLocale,
    setLocale,
    t,
    localeSwitcherEnabled: true,
    localeOptions: LOCALE_OPTIONS,
    languageFieldLabel: getLanguageFieldLabel(resolvedLocale, t),
    userCenterLabel:
      USER_CENTER_LABEL[resolvedLocale] ?? USER_CENTER_LABEL['en-US'],
  }
}
