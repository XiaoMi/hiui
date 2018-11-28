import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import locales from '../../locales'
import Page, { Logo, NavGroup } from '@hi-ui/classic-theme'

import logoImg from '../../static/img/logo.png'
import routes from './router'
import LocaleDropdown from '../Component/Dropdown/LocaleDropdown'
import ThemeDropdown from '../Component/Dropdown/ThemeDropdown'

import './index.scss'

class Doc extends Component {
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
    const doc = this.getCurrentDoc()

    return (
      <React.Fragment>
        <NavGroup pos='right'>
          <NavGroup.Item>
            <Link to={`/#/${locale}`}>首页</Link>
          </NavGroup.Item>
          <NavGroup.Item>
            <Link to={`/#/${locale}/components`} className={doc === 'components' ? 'header__nav-item--active' : ''}>组件</Link>
          </NavGroup.Item>
          <NavGroup.Item>
            <LocaleDropdown locale={locale} />
          </NavGroup.Item>
          <NavGroup.Item>
            <ThemeDropdown locale={locale} />
          </NavGroup.Item>
        </NavGroup>
      </React.Fragment>
    )
  }

  render () {
    const { sider } = this.props
    const header = this.renderHeader()
    const logo = <Logo
      url='https://xiaomi.github.io/hiui/#/'
      logoUrl={logoImg}
      text='HIUI Design'
      title='HIUI Design'
      alt='HIUI Logo'
      height={40}
    />

    return (
      <Page
        header={header}
        logo={logo}
        sider={sider}
        routes={routes}
        theme={{
          type: 'flat',
          color: 'white'
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
