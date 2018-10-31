const initState = {
  sider: {
    items: []
  },
  theme: window.localStorage.getItem('HIUI_THEME') || 'hiui-blue',
  locale: window.localStorage.getItem('HIUI_LANGUAGE') || 'zh-CN'
}

export default (state = initState, action) => {
  const {
    type,
    sider,
    theme,
    locale
  } = action

  switch (type) {
    case 'GLOBAL_SIDER':
      return Object.assign({}, state, {sider})
    case 'SET_THEME':
      return Object.assign({}, state, {theme})
    case 'SET_LOCALE':
      return Object.assign({}, state, {locale})
    default:
      return Object.assign({}, state)
  }
}
