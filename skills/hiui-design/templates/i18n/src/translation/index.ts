import { useMemo, useSyncExternalStore } from 'react'
import { DEMO_TRANSLATION_OVERRIDES } from './demo-overrides'
import { TRANSLATION_MESSAGES } from './messages'

export const SUPPORTED_LOCALES = [
  'zh-CN',
  'zh-TW',
  'en-US',
  'id-ID',
  'th-TH',
  'de-DE',
  'ar-SA',
] as const

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

type TranslationParams = Record<string, string | number | boolean | null | undefined>
type TranslationCatalog = Record<string, string>
type LocaleDirection = 'ltr' | 'rtl'

const DEFAULT_LOCALE: SupportedLocale = 'zh-CN'
const RTL_LOCALES = new Set<SupportedLocale>(['ar-SA'])
const LOCALE_STORAGE_KEY = 'hiui-demo-locale'
const TEXT_EXPANSION_MULTIPLIER: Record<SupportedLocale, number> = {
  'zh-CN': 1,
  'zh-TW': 1,
  'en-US': 1.5,
  'id-ID': 1.5,
  'th-TH': 2,
  'de-DE': 2.5,
  'ar-SA': 2,
}

let currentLocale: SupportedLocale = DEFAULT_LOCALE
const listeners = new Set<() => void>()

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale)
}

function getCatalog(locale: SupportedLocale): TranslationCatalog {
  return {
    ...(TRANSLATION_MESSAGES[locale] ?? TRANSLATION_MESSAGES[DEFAULT_LOCALE]),
    ...(DEMO_TRANSLATION_OVERRIDES[locale] ?? {}),
  }
}

function getFallbackLocale(locale: SupportedLocale): SupportedLocale {
  if (locale === 'zh-TW') return 'zh-CN'
  if (locale === 'zh-CN') return 'zh-CN'
  return 'en-US'
}

function shouldUseFallbackTranslation(
  locale: SupportedLocale,
  key: string,
  primaryTemplate: string | undefined
) {
  if (!primaryTemplate) return true
  if (locale === 'zh-CN' || locale === 'zh-TW') return false
  if (primaryTemplate === key) return true
  return /[\u4e00-\u9fff]/.test(primaryTemplate)
}

function normalizeLocaleCandidate(locale?: string | null): SupportedLocale | null {
  if (!locale) return null
  if (isSupportedLocale(locale)) return locale

  const normalized = locale.toLowerCase()

  if (normalized.startsWith('zh-tw') || normalized.startsWith('zh-hk')) return 'zh-TW'
  if (normalized.startsWith('zh')) return 'zh-CN'
  if (normalized.startsWith('en')) return 'en-US'
  if (normalized.startsWith('id')) return 'id-ID'
  if (normalized.startsWith('th')) return 'th-TH'
  if (normalized.startsWith('de')) return 'de-DE'
  if (normalized.startsWith('ar')) return 'ar-SA'

  return null
}

function resolvePreferredLocale(locale?: string) {
  const directMatch = normalizeLocaleCandidate(locale)
  if (directMatch) return directMatch

  if (typeof window !== 'undefined') {
    const stored = normalizeLocaleCandidate(window.localStorage.getItem(LOCALE_STORAGE_KEY))
    if (stored) return stored

    for (const candidate of window.navigator.languages ?? []) {
      const matched = normalizeLocaleCandidate(candidate)
      if (matched) return matched
    }

    const navigatorMatch = normalizeLocaleCandidate(window.navigator.language)
    if (navigatorMatch) return navigatorMatch
  }

  return DEFAULT_LOCALE
}

function interpolate(template: string, params?: TranslationParams) {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key]
    return value == null ? '' : String(value)
  })
}

function applyDocumentLocale(locale: SupportedLocale) {
  if (typeof document === 'undefined') return
  const direction = RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
  document.documentElement.lang = locale
  document.documentElement.dir = direction
}

function persistLocale(locale: SupportedLocale) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
}

function notifyListeners() {
  for (const listener of listeners) {
    listener()
  }
}

export function getCurrentLocale(): SupportedLocale {
  return currentLocale
}

export function getDirection(locale: SupportedLocale = currentLocale): LocaleDirection {
  return RTL_LOCALES.has(locale) ? 'rtl' : 'ltr'
}

export function getTextExpansionMultiplier(locale: SupportedLocale = currentLocale) {
  return TEXT_EXPANSION_MULTIPLIER[locale]
}

export function initTranslation(locale?: string) {
  const nextLocale = resolvePreferredLocale(locale)
  currentLocale = nextLocale
  applyDocumentLocale(nextLocale)
  persistLocale(nextLocale)
  notifyListeners()
  return nextLocale
}

export function setLocale(locale: string) {
  return initTranslation(locale)
}

export function subscribeLocale(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getTranslation(key: string, params?: TranslationParams, locale: SupportedLocale = currentLocale) {
  const primaryCatalog = getCatalog(locale)
  const fallbackCatalog = getCatalog(getFallbackLocale(locale))
  const primaryTemplate = primaryCatalog[key]
  const template = shouldUseFallbackTranslation(locale, key, primaryTemplate)
    ? fallbackCatalog[key] ?? primaryTemplate ?? key
    : primaryTemplate ?? fallbackCatalog[key] ?? key
  return interpolate(template, params)
}

export function formatDate(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
  locale: SupportedLocale = currentLocale
) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(value))
}

export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale: SupportedLocale = currentLocale
) {
  return new Intl.NumberFormat(locale, options).format(value)
}

export function formatCurrency(
  value: number,
  currency: string,
  locale: SupportedLocale = currentLocale,
  options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options,
  }).format(value)
}

export function formatPercent(
  value: number,
  locale: SupportedLocale = currentLocale,
  options?: Omit<Intl.NumberFormatOptions, 'style'>
) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    ...options,
  }).format(value)
}

export function getLocaleCollator(locale: SupportedLocale = currentLocale, options?: Intl.CollatorOptions) {
  return new Intl.Collator(locale, options)
}

export function useLocale() {
  return useSyncExternalStore(subscribeLocale, getCurrentLocale, getCurrentLocale)
}

export function useTranslation() {
  const locale = useLocale()

  return useMemo(
    () => ({
      locale,
      dir: getDirection(locale),
      t: (key: string, params?: TranslationParams) => getTranslation(key, params, locale),
      formatDate: (value: string | number | Date, options?: Intl.DateTimeFormatOptions) =>
        formatDate(value, options, locale),
      formatNumber: (value: number, options?: Intl.NumberFormatOptions) =>
        formatNumber(value, options, locale),
      formatCurrency: (
        value: number,
        currency: string,
        options?: Omit<Intl.NumberFormatOptions, 'style' | 'currency'>
      ) => formatCurrency(value, currency, locale, options),
      formatPercent: (value: number, options?: Omit<Intl.NumberFormatOptions, 'style'>) =>
        formatPercent(value, locale, options),
      setLocale,
      textExpansionMultiplier: getTextExpansionMultiplier(locale),
    }),
    [locale]
  )
}

initTranslation()
