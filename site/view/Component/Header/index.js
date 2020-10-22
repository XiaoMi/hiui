import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { NavGroup } from '@hi-ui/classic-theme'
// import LocaleDropdown from '../Dropdown/LocaleDropdown'
import locales from '../../../locales'

export default class NavHeader extends Component {
  render() {
    const { locale } = this.props
    const { home, components, template, design, docs } = locales[locale].headers
    return (
      <React.Fragment>
        <NavGroup position="right">
          <NavGroup.Item>
            <NavLink to={`<BASE_URL>/${locale}`} exact activeClassName="header__nav-link--active">
              {home}
            </NavLink>
          </NavGroup.Item>

          <NavGroup.Item>
            <NavLink to={`<BASE_URL>/${locale}/designs/summarize`} activeClassName="header__nav-link--active">
              {design}
            </NavLink>
          </NavGroup.Item>

          <NavGroup.Item>
            <NavLink to={`<BASE_URL>/${locale}/docs/quick-start`} activeClassName="header__nav-link--active">
              {docs}
            </NavLink>
          </NavGroup.Item>

          <NavGroup.Item>
            <NavLink to={`<BASE_URL>/${locale}/components/grid`} activeClassName="header__nav-link--active">
              {components}
            </NavLink>
          </NavGroup.Item>

          <NavGroup.Item>
            <NavLink to={`<BASE_URL>/${locale}/templates/portal`} activeClassName="header__nav-link--active">
              {template}
            </NavLink>
          </NavGroup.Item>

          {/* <NavGroup.Item>
            <LocaleDropdown changeDropdown={val => onLocaleChange(val)} />
          </NavGroup.Item> */}

          <NavGroup.Item>
            <a href="https://github.com/XiaoMi/hiui">
              <i className="hi-fa fa-github" />
            </a>
          </NavGroup.Item>
        </NavGroup>
      </React.Fragment>
    )
  }
}
