import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import locales from '../../locales'
import Dashboard, { Logo } from '@hi-ui/classic-theme'

import logoImg from '../../static/img/logo.png'
import routes from './router'
import LocaleDropdown from '../Component/Dropdown/LocaleDropdown'
import ThemeDropdown from '../Component/Dropdown/ThemeDropdown'

import './index.scss'

// 引入组件样式
// const req = require.context('../../../components', true, /^\.\/[^_][\w-]+\/style\/index\.js?$/)
// req.keys().forEach((mod) => {
//   let v = req(mod)
//   if (v && v.default) {
//     v = v.default
//   }
// })

class Doc extends Component {
  // constructor (props) {
  //   super(props)

  //   // this.hashChangeEvent = this.hashChangeEvent.bind(this)
  // }

  componentDidMount () {

    // window.addEventListener('hashchange', this.hashChangeEvent)
  }

  componentWillUnmount () {
    // window.removeEventListener('hashchange', this.hashChangeEvent)
  }

  // hashChangeEvent () {
  //   let locale = window.location.hash.split('/')[1]

  //   if (!locale) { return }

  //   // 临时用于隐藏语言
  //   if (locale !== 'zh-CN') {
  //     window.location.hash = window.location.hash.replace(locale, 'zh-CN')
  //   }

  //   if (locale !== window.localStorage.getItem('HIUI_LANGUAGE')) {
  //     window.localStorage.setItem('HIUI_LANGUAGE', locale)

  //     this.setState({locale})
  //   }
  // }

  // 保存语言类型
  storeLang () {
    let locale = window.location.hash.split('/')[1]

    if (!locale || !(locale in locales)) {
      locale = 'zh-CN'
    }

    window.localStorage.setItem('HIUI_LANGUAGE', locale)

    return locale
  }

  getCurrentDoc () {
    const doc = window.location.hash.split('/')
    if (doc[2] === 'components') {
      return doc[2]
    } else if (doc[2] === 'docs') {
      return doc[3]
    }
  }

  renderHeader () {
    const {
      locale
    } = this.props

    // const LANG = {
    //   'zh-CN': 'English',
    //   'en-US': '中文'
    // }

    const doc = this.getCurrentDoc()

    return (
      <React.Fragment>
        <Logo
          url='https://xiaomi.github.io/hiui/'
          logoUrl={logoImg}
          height={40}
          text='HIUI Design'
        />
        <ul className='header-nav'>
          <li><Link to={`/${locale}`}>首页</Link></li>
          {/* <li><Link to={`/${locale}/docs/design`} className={doc === 'design' ? 'active' : ''}>设计规范</Link></li> */}
          <li><Link to={`/${locale}/components`} className={doc === 'components' ? 'active' : ''}>组件</Link></li>
          <li>
            <LocaleDropdown locale={locale} />
          </li>
          <li>
            <ThemeDropdown locale={locale} />
          </li>
        </ul>
      </React.Fragment>
    )
  }

  render () {
    const { sider } = this.props
    const header = this.renderHeader()

    return (
      <Dashboard
        header={header}
        sider={sider}
        routes={routes}
        theme={{
          type: 'outer',
          color: 'light'
        }}
      />
    )
  }
}

export default connect(state => ({
  sider: state.global.sider,
  theme: state.global.theme,
  locale: state.global.locale
}))(Doc)
