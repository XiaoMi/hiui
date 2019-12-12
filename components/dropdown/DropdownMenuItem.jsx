import React, { forwardRef } from 'react'
import classNames from 'classnames'
import Icon from '../icon'
import DropdownMenu from './DropdownMenu'
import { prefixCls } from '.'

const MenuItemWrapper = forwardRef(({ href, children, disabled, ...props }, ref) => {
  const shouldUseLink = href && !disabled
  if (disabled) {
    Reflect.deleteProperty(props, 'onMouseEnter')
    Reflect.deleteProperty(props, 'onMouseLeave')
    Reflect.deleteProperty(props, 'onClick')
  }
  return (
    <li ref={ref} {...props} >
      {shouldUseLink ? <a href={href}>{children}</a> : children}
    </li>
  )
})

export default class DropdownMenuItem extends React.Component {
  refItem = React.createRef()
  timerHideDropdownMenu = null
  state = {
    visible: false
  }
  setMenuHide = () => {
    this.timerHideDropdownMenu = setTimeout(() => {
      this.setState({
        visible: false
      })
    }, 200)
  }
  handleMenuItemMouseEnter = () => {
    clearTimeout(this.timerHideDropdownMenu)
    this.setState({
      visible: true
    })
  }
  handleMenuItemMouseLeave = () => {
    this.setMenuHide()
  }
  handleMenuMouseEnter = () => {
    const { onChildMenuMouseEnter } = this.props
    onChildMenuMouseEnter && onChildMenuMouseEnter()
    clearTimeout(this.timerHideDropdownMenu)
  }
  handleMenuMouseLeave = () => {
    const { onChildMenuMouseLeave } = this.props
    onChildMenuMouseLeave && onChildMenuMouseLeave()
    this.setMenuHide()
  }

  handleMenuItemClick = () => {
    const { onMenuItemClick, id } = this.props
    onMenuItemClick(id)
  }
  render () {
    const {
      title,
      children,
      parentPopperVisible,
      href,
      disabled,
      onMenuItemClick,
      width
    } = this.props
    const { visible } = this.state
    const shouldRenderDivider = title === '-'
    const itemCls = classNames(
      `${prefixCls}__menu-item`,
      disabled && `${prefixCls}__menu-item--disabled`
    )
    const iconCls = classNames(
      `${prefixCls}__menu-item__icon`,
      visible && `${prefixCls}__menu-item__icon--active`
    )
    return shouldRenderDivider ? (
      <li className={`${prefixCls}__divider`} />
    ) : (
      <MenuItemWrapper
        className={itemCls}
        ref={this.refItem}
        onMouseEnter={this.handleMenuItemMouseEnter}
        onMouseLeave={this.handleMenuItemMouseLeave}
        href={href}
        disabled={disabled}
        onClick={this.handleMenuItemClick}
      >
        <span>{title}</span>
        {children && (
          <React.Fragment>
            <Icon name='right' className={iconCls} />
            <DropdownMenu
              data={children}
              visible={visible && parentPopperVisible}
              placement='right-start'
              attachEle={this.refItem.current}
              onMouseLeave={this.handleMenuMouseLeave}
              onMouseEnter={this.handleMenuMouseEnter}
              onChildMenuMouseEnter={this.handleMenuMouseEnter}
              onChildMenuMouseLeave={this.handleMenuMouseLeave}
              onMenuItemClick={onMenuItemClick}
              width={width}
            />
          </React.Fragment>
        )}
      </MenuItemWrapper>
    )
  }
}
