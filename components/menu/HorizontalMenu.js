import React from 'react'
import MixinMenu from './MixinMenu'

export default class HorizontalMenu extends MixinMenu {
  static componentName = 'HorizontalMenu'

  render () {
    const {
      children
    } = this.renderChildren(this.props.children, HorizontalMenu.componentName)

    return (
      <ul className='hi-menu-items'>
        {children}
      </ul>
    )
  }
}
