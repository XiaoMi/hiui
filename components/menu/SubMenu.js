import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import Icon from '../icon'
import Title from './Title'
import Provider from '../context'
class SubMenu extends Component {
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
  }

  renderPopperMenu (deepSubmenu, isExpand) {
    const {
      mini,
      datas,
      index,
      renderMenu,
      fatMenu,
      clickInside,
      theme
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
          classNames('hi-submenu__popper', `theme__${theme}`, {'hi-submenu__popper--fat': fatMenu})
        }
        width={false}
        placement={placement}
      >
        <ul
          className={classNames('hi-submenu__items')}
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
      clickInside,
      theme
    } = this.props
    return (
      <ul
        className={classNames('hi-submenu__items', `theme__${theme}`, {'hi-submenu__items--hide': !isExpand})}
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
      fatMenu,
      theme
    } = this.props
    const isExpand = this.checkExpand(activeIndex, expandIndex, index)
    const isActive = this.checkActive(activeIndex, index)
    const deepSubmenu = index.split('-').length > 1
    const cls = classNames('hi-menu-item', `theme__${theme}`, 'hi-submenu', `hi-menu--${level}`, {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': isActive,
      'hi-submenu--fat': fatMenu
    })
    let toggleIcon
    if (mode === 'horizontal' && !deepSubmenu) {
      toggleIcon = 'down'
    } else if (deepSubmenu && (mode === 'horizontal' || mini)) {
      toggleIcon = 'right'
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
          className={`theme__${theme} hi-submenu__title hi-menu__title`}
          onClick={() => {
            !disabled && this.onClick(index)
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

SubMenu.propTypes = {
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

SubMenu.defaultProps = {
  level: 1,
  expandIndex: []
}

export default Provider(SubMenu)
