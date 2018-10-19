import store from '../store'

export const globalSider = (sider) => {
  const dispatch = store.dispatch

  dispatch({type: 'GLOBAL_SIDER', sider})
}

export const setTheme = (theme) => (dispatch) => {
  dispatch({type: 'SET_THEME', theme})
  window.localStorage.setItem('HIUI_THEME', theme)
  return Promise.resolve()
}
export const setLocale = (locale) => (dispatch) => {
  const oldState = store.getState()
  window.location.hash = window.location.hash.replace(oldState.global.locale, locale)

  dispatch({type: 'SET_LOCALE', locale})
  window.localStorage.setItem('HIUI_LANGUAGE', locale)
  return Promise.resolve()
}
