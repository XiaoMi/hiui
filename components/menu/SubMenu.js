import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import Icon from '../icon'
import Title from './Title'

export default class SubMenu extends Component {
  static componentName = 'SubMenu'

  static propTypes = {
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    datas: PropTypes.array,
    renderMenu: PropTypes.func,
    onClick: PropTypes.func,
    index: PropTypes.string,
    level: PropTypes.number,
    mode: PropTypes.oneOf(['horizontal', 'vertical']),
    mini: PropTypes.bool,
    fatMenu: PropTypes.bool,
    disabled: PropTypes.bool,
    activeIndex: PropTypes.string,
    expandIndex: PropTypes.array
  }

  static defaultProps = {
    level: 1,
    expandIndex: []
  }

  onClick (index) {
    this.props.onClick(index)
  }

  checkActive (activeIndex, index) {
    return activeIndex.indexOf(index) === 0
  }

  checkExpand (activeIndex, expandIndex, index) {
    return expandIndex.some(item => {
      return item.indexOf(index) === 0
    })

    // const {
    //   mini,
    //   mode
    // } = this.props

    // if (!mini && mode==='vertical' && expandIndex.length===0) {
    //   return activeIndex.indexOf(index) === 0
    // } else {
    //   return expandIndex.some(item => {
    //     // return item.indexOf(index) === 0 || (activeIndex.indexOf(item) === 0 && activeIndex.indexOf(index) === 0)
    //     return item.indexOf(index) === 0
    //   })
    // }
  }

  renderPopperMenu (deepSubmenu, isExpand) {
    const {
      mini,
      datas,
      index,
      renderMenu,
      fatMenu,
      clickInside
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
          classNames('hi-submenu__popper', {'hi-submenu__popper--fat': fatMenu})
        }
        width={false}
        placement={placement}
      >
        <ul
          className={classNames('hi-submenu__items')}
          ref={node => { this.submenuNode = node }}
          onClick={() => clickInside()} // 利用事件冒泡设置clickInsideFlag
        >
          { renderMenu(datas, index) }
        </ul>
      </Popper>
    )
  }

  renderVerticalMenu (isActive, isExpand) {
    const {
      datas,
      index,
      renderMenu,
      clickInside
    } = this.props
    return (
      <ul
        className={classNames('hi-submenu__items', {'hi-submenu__items--hide': !isExpand})}
        onClick={() => clickInside()} // 利用事件冒泡设置clickInsideFlag
        key={index}
      >
        { renderMenu(datas, index) }
      </ul>
    )
  }

  render () {
    const {
      content,
      icon,
      mode,
      mini,
      level,
      index,
      activeIndex,
      expandIndex,
      disabled,
      fatMenu
    } = this.props
    const isExpand = this.checkExpand(activeIndex, expandIndex, index)
    const isActive = this.checkActive(activeIndex, index)
    const deepSubmenu = index.split('-').length > 1
    const cls = classNames('hi-menu-item', 'hi-submenu', `hi-menu--${level}`, {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': isActive,
      'hi-submenu--fat': fatMenu
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
        key={index}
      >
        <div
          className='hi-submenu__title hi-menu__title'
          onClick={() => {
            if (!disabled) {
              this.onClick(index)
            }
          }}
        >
          <Title icon={icon} content={content} />
          <div className='hi-menu__title-toggle-icon'>
            <Icon name={toggleIcon} />
          </div>
        </div>
        {
          !mini && mode === 'vertical'
            ? this.renderVerticalMenu(isActive, isExpand)
            : this.renderPopperMenu(deepSubmenu, isExpand)
        }
      </li>
    )
  }
}
