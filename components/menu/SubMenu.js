import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MixinMenu from './MixinMenu'
import Popper from '../popper'
import Icon from '../icon'

export default class SubMenu extends MixinMenu {
  static propTypes = {
    title: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      showSubmenu: false
    }
  }

  onClick (id) {
    this.setState({
      showSubmenu: false
    })
    super.onClick(id)
  }

  render () {
    const {
      showSubmenu
    } = this.state
    const {
      title
    } = this.props
    const {
      children,
      childIsActive
    } = this.renderChildren(this.props.children)
    const cls = classNames('hi-menu-item', 'hi-submenu', {
      'hi-menu-item--active': childIsActive
    })
    const icon = showSubmenu ? 'up' : 'down'

    return (
      <li
        className={cls}
        ref={node => { this.submenu = node }}
        onClick={() => {
          this.setState({
            showSubmenu: true
          })
        }}
      >
        <div className='hi-menu-item__title'>
          {title}
        </div>
        <div className='hi-menu-item__expand-icon'>
          <Icon name={icon} />
        </div>
        <Popper
          show={showSubmenu}
          attachEle={this.submenu}
          zIndex={1050}
          topGap={5}
          className='hi-submenu__popper'
          width={false}
        >
          <ul className='hi-menu-items'>
            {children}
          </ul>
        </Popper>
      </li>
    )
  }
}
