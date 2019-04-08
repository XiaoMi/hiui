import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

import {NavGroup} from '@hi-ui/classic-theme'
import LocaleDropdown from '../Dropdown/LocaleDropdown'
import locales from '../../../locales'
export default class NavHeader extends Component {
  render () {
    const {locale, onLocaleChange} = this.props
    const {home, components, template} = locales[locale].headers
    return <React.Fragment>
      <NavGroup position='right'>
        <NavGroup.Item>
          <NavLink to={`/${locale}`} exact activeClassName='header__nav-link--active'>{home}</NavLink>
        </NavGroup.Item>
        {/* <NavGroup.Item>
          <NavLink to={`/${locale}/designs/values`} activeClassName='header__nav-link--active'>{design}</NavLink>
        </NavGroup.Item> */}
        <NavGroup.Item>
          <NavLink to={`/${locale}/docs/quick-start`} activeClassName='header__nav-link--active'>{components}</NavLink>
        </NavGroup.Item>
        <NavGroup.Item>
          <NavLink to={`/${locale}/templates/portal`} activeClassName='header__nav-link--active'>{template}</NavLink>
        </NavGroup.Item>
        <NavGroup.Item>
          <LocaleDropdown changeDropdown={(val) => onLocaleChange(val)} />
        </NavGroup.Item>

      </NavGroup>
    </React.Fragment>
  }
}
