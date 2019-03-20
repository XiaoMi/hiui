import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import Icon from '../icon'

export default class SubMenu extends Component {
  static componentName = 'SubMenu'

  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    showParentSubmenu: PropTypes.bool,
    level: PropTypes.number,
    groupSubMenu: PropTypes.bool
  }

  static defaultProps = {
    showParentSubmenu: false,
    level: 1
  }

  constructor (props) {
    super(props)

    this.clickOutsideHandel = this.clickOutside.bind(this)
  }

  componentDidMount () {
    window.addEventListener('click', this.clickOutsideHandel)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.clickOutsideHandel)
  }

  clickOutside (e) {
    if (
      (ReactDOM.findDOMNode(this.submenuTrigger) && ReactDOM.findDOMNode(this.submenuTrigger).contains(e.target)) ||
      (ReactDOM.findDOMNode(this.submenuNode) && ReactDOM.findDOMNode(this.submenuNode).contains(e.target))
    ) {
      return
    }
    this.hidePopper()
  }

  hidePopper () {
    this.onClick('')
  }

  onClick (indexs) {
    this.props.onClick(indexs)
  }

  render () {
    const {
      content,
      datas,
      indexs,
      isExpand,
      isActive,
      renderMenu,
      groupSubMenu
    } = this.props

    const deepSubmenu = indexs.split('-').length > 1
    const cls = classNames('hi-menu-item', 'hi-submenu', {
      'hi-menu-item--active': isActive,
      'hi-submenu--sub': deepSubmenu,
      'hi-submenu--group': groupSubMenu
    })
    let leftGap
    let topGap
    let placement
    let icon
    if (deepSubmenu) {
      leftGap = 16
      topGap = -4
      placement = 'right-start'
      icon = isExpand ? 'left' : 'right'
    } else {
      leftGap = 0
      topGap = 5
      placement = 'bottom-start'
      icon = isExpand ? 'up' : 'down'
    }

    return (
      <li
        className={cls}
        ref={node => { this.submenuTrigger = node }}
        onClick={(e) => {
          e.stopPropagation()
          this.onClick(indexs)
        }}
      >
        <div className='hi-menu-item__content'>
          {content}
        </div>
        <div className='hi-menu-item__expand-icon'>
          <Icon name={icon} />
        </div>
        <Popper
          show={isExpand}
          attachEle={this.submenuTrigger}
          zIndex={1050}
          topGap={topGap}
          leftGap={leftGap}
          className={
            classNames('hi-submenu__popper', {'hi-submenu__popper--group': groupSubMenu})
          }
          width={false}
          placement={placement}
        >
          <ul className={classNames('hi-submenu__content')} ref={node => { this.submenuNode = node }}>
            { renderMenu(datas, indexs) }
          </ul>
        </Popper>
      </li>
    )
  }
}

SubMenu.contextTypes = {
  component: PropTypes.any
}
