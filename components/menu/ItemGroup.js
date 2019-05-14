import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MixinMenu from './MixinMenu'

export default class ItemGroup extends MixinMenu {
  static componentName = 'ItemGroup'

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  }

  render () {
    const {
      title
    } = this.props
    const {
      children
    } = this.renderChildren(this.props.children, ItemGroup.componentName)
    const cls = classNames('hi-menu-group')

    return (
      <li className={cls}>
        <div className='hi-menu-group__title'>
          {title}
        </div>
        <ul className='hi-menu-group__content'>
          {children}
        </ul>
      </li>
    )
  }
}
