import store from '../store'

export const globalSider = sider => {
  const dispatch = store.dispatch

  dispatch({ type: 'GLOBAL_SIDER', sider })
}

export const setTheme = theme => dispatch => {
  dispatch({ type: 'SET_THEME', theme })
  window.localStorage.setItem('HIUI_THEME', theme)
  return Promise.resolve()
}
export const setLocale = locale => dispatch => {
  const oldState = store.getState()
  window.location.hash = window.location.hash.replace(oldState.global.locale, locale)

  dispatch({ type: 'SET_LOCALE', locale })
  window.localStorage.setItem('HIUI_LANGUAGE', locale)
  return Promise.resolve()
}

export const setDesignNavs = designNavs => {
  const dispatch = store.dispatch
  dispatch({ type: 'SET_DESIGNNAVS', designNavs })
}

export const setComponentsNavs = componentsNavs => {
  const dispatch = store.dispatch
  dispatch({ type: 'SET_COMPONENTSNAVS', componentsNavs })
}
export const setComponents = components => {
  const dispatch = store.dispatch
  dispatch({ type: 'SET_COMPONENTS', components })
}
export const setTemplatesNavs = templatesNavs => {
  const dispatch = store.dispatch
  dispatch({ type: 'SET_TEMPLATESNAVS', templatesNavs })
}
