import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import Icon from '../icon'
import Title from './Title'

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

  renderPopperMenu (deepSubmenu) {
    const {
      mini,
      datas,
      indexs,
      isExpand,
      renderMenu,
      groupSubMenu
    } = this.props
    let leftGap
    let topGap
    let placement
    if (deepSubmenu || mini) {
      // leftGap = mini && !deepSubmenu ? 0 : 16 // 非mini状态有个16px的right-padding，所以要补偿一下
      leftGap = 0
      topGap = -4
      placement = 'right-start'
    } else {
      leftGap = 0
      topGap = 5
      placement = 'bottom-start'
    }

    return (
      <Popper
        show={isExpand}
        attachEle={this.submenuTrigger}
        zIndex={1050}
        topGap={topGap}
        leftGap={leftGap}
        className={
          classNames('hi-submenu__popper', {'hi-submenu__popper--fat': groupSubMenu})
        }
        width={false}
        placement={placement}
      >
        <ul className={classNames('hi-submenu__items')} ref={node => { this.submenuNode = node }}>
          { renderMenu(datas, indexs) }
        </ul>
      </Popper>
    )
  }

  renderVerticalMenu () {
    const {
      isActive,
      isExpand,
      datas,
      indexs,
      renderMenu
    } = this.props

    return (
      <ul className={classNames('hi-submenu__items', {'hi-submenu__items--hide': !isExpand && !isActive})}>
        { renderMenu(datas, indexs) }
      </ul>
    )
  }

  render () {
    const {
      content,
      icon,
      mode,
      mini,
      indexs,
      isExpand,
      disabled,
      isActive,
      groupSubMenu
    } = this.props
    const level = indexs.split('-').length

    const deepSubmenu = indexs.split('-').length > 1
    const cls = classNames('hi-menu-item', 'hi-submenu', `hi-menu--${level}`, {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': isActive,
      'hi-submenu--sub': deepSubmenu,
      'hi-submenu--fat': groupSubMenu
    })
    let toggleIcon
    if (deepSubmenu && (mode === 'horizontal' || mini)) {
      toggleIcon = isExpand ? 'left' : 'right'
    } else {
      toggleIcon = isExpand ? 'up' : 'down'
    }

    return (
      <li
        className={cls}
        ref={node => { this.submenuTrigger = node }}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) {
            this.onClick(indexs)
          }
        }}
      >
        <div className='hi-submenu__title hi-menu__title'>
          <Title icon={icon} content={content} />
          <div className='hi-menu__title-toggle-icon'>
            <Icon name={toggleIcon} />
          </div>
        </div>
        {
          !mini && mode === 'vertical'
            ? this.renderVerticalMenu()
            : this.renderPopperMenu(deepSubmenu)
        }
      </li>
    )
  }
}

SubMenu.contextTypes = {
  component: PropTypes.any
}
