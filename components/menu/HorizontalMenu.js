import React from 'react'
import MixinMenu from './MixinMenu'

export default class HorizontalMenu extends MixinMenu {
  render () {
    const {
      children
    } = this.renderChildren(this.props.children)

    return (
      <ul className='hi-menu-items'>
        {children}
      </ul>
    )
  }
}
