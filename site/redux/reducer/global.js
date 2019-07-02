const initState = {
  sider: {
    items: []
  },
  theme: window.localStorage.getItem('HIUI_THEME') || 'hiui-blue',
  locale: window.localStorage.getItem('HIUI_LANGUAGE') || 'zh-CN'
}

export default (state = initState, action = '') => {
  const {
    type,
    sider,
    theme,
    locale,
    designNavs,
    componentsNavs,
    templatesNavs,
    components
  } = action
  switch (type) {
    case 'GLOBAL_SIDER':
      return Object.assign({}, state, { sider })
    case 'SET_THEME':
      return Object.assign({}, state, { theme })
    case 'SET_LOCALE':
      return Object.assign({}, state, { locale })
    case 'SET_DESIGNNAVS':
      return Object.assign({}, state, { designNavs })
    case 'SET_COMPONENTSNAVS':
      return Object.assign({}, state, { componentsNavs })
    case 'SET_TEMPLATESNAVS':
      return Object.assign({}, state, { templatesNavs })
    case 'SET_COMPONENTS':
      return Object.assign({}, state, { components })
    default:
      return Object.assign({}, state)
  }
}
