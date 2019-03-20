import React, { Component } from 'react'

export default class HorizontalMenu extends Component {
  static componentName = 'HorizontalMenu'

  render () {
    return (
      <ul className='hi-menu-items'>
        {this.props.children}
      </ul>
    )
  }
}
