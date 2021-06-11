import locales from '../locales'

const legalLocales = Object.keys(locales).map((v) => v.toLowerCase())

function getLocaleFromPath (url = window.location.pathname) {
  url = url.replace('/hiui', '').toLowerCase()
  let currentLocale = ''
  for (const item of legalLocales) {
    if (url.includes(item)) {
      currentLocale = item
      break
    }
  }
  return currentLocale
}

function getTopNavFromPath (url = window.location.pathname) {
  url = url.replace('/hiui', '').replace('/v2', '').toLowerCase()
  const locale = getLocaleFromPath(url)
  return url
    .replace(locale, '')
    .replace(/^\/*/, '')
    .replace(/\/.*/, '')
}

function getPageFromPath (url = window.location.pathname) {
  url = url.replace('/hiui', '').replace('/v2', '').toLowerCase()
  const locale = getLocaleFromPath(url)
  const topNav = getTopNavFromPath(url)
  return url
    .replace(locale, '')
    .replace(topNav, '')
    .replace(/^\/*/, '')
    .replace(/\/.*/, '')
}

export default {
  getLocaleFromPath,
  getTopNavFromPath,
  getPageFromPath
}
