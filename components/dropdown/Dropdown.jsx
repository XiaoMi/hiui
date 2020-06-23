import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import DropdownButton from './DropdownButton'
import DropdownMenu, { propTypesOfMenuData } from './DropdownMenu'
import Provider from '../context'

import { prefixCls } from '.'
import { getIsTriggerEqualHover, getIsTriggerEqualContextmenu, trimTriggers } from './utils'
class Dropdown extends React.Component {
  refDropdown = React.createRef()
  timerHideMenu = null
  state = {
    visible: false
  }
  eventHandler (event) {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
      if (event.nativeEvent && event.nativeEvent.stopImmediatePropagation) {
        event.nativeEvent.stopImmediatePropagation()
      }
    }
  }
  setPopperShow = (event) => {
    event.preventDefault()
    clearTimeout(this.timerHideMenu)
    this.setState({ visible: true })
  }
  setPopperHide = (event) => {
    event.preventDefault()
    this.setState({ visible: false })
  }
  setPopperDelayHide = (event) => {
    this.eventHandler(event)
    this.timerHideMenu = setTimeout(() => {
      this.setState({ visible: false })
    }, 100)
  }
  toggleVisible = () => {
    const { visible } = this.state
    const toggleVisible = visible ? this.setPopperHide : this.setPopperShow
    return toggleVisible
  }
  getPopperShowHandler = () => {
    const { disabled } = this.props
    if (disabled) return {}
    const triggers = trimTriggers(this.props)
    const getHandler = (props) => {
      if (getIsTriggerEqualHover(props)) {
        return {
          onMouseEnter: this.setPopperShow
        }
      }
      if (getIsTriggerEqualContextmenu(props)) {
        return {
          onContextMenu: this.toggleVisible()
        }
      }
      return {
        onClick: this.toggleVisible()
      }
    }
    return triggers.reduce((prev, cur) => Object.assign(prev, getHandler(cur)), {})
  }
  getPopperHideHandler = () => {
    const { disabled } = this.props
    if (disabled) return {}
    return getIsTriggerEqualHover(this.props) ? {
      onMouseLeave: this.setPopperDelayHide
    } : {}
  }
  handleMenuMouseLeave = () => {
    getIsTriggerEqualHover(this.props) && this.setPopperDelayHide()
  }
  handleMenuMouseEnter = () => {
    clearTimeout(this.timerHideMenu)
  }
  handleChildMenuMouseEnter = () => {
    clearTimeout(this.timerHideMenu)
  }
  handleChildMenuMouseLeave = () => {
    getIsTriggerEqualHover(this.props) && this.setPopperDelayHide()
  }
  handleMenuItemClick = (data, isLinkOrNoChildren) => {
    const { onClick } = this.props
    if (isLinkOrNoChildren || onClick) {
      this.setPopperDelayHide()
    }

    onClick && onClick(data)
  }
  handleDocumentClick = (e) => {
    if (this.refDropdown.current) {
      !this.refDropdown.current.contains(e.target) && this.setState({ visible: false })
    }
  }
  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick)
    document.removeEventListener('contextmenu', this.handleDocumentClick)
  }
  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick)
    document.addEventListener('contextmenu', this.handleDocumentClick)
  }
  render () {
    const { className, style, title, type, placement, data, disabled, width, onButtonClick, theme } = this.props
    const { visible } = this.state
    const dropdownCls = classNames(prefixCls, prefixCls + '--' + type, className, disabled && `${prefixCls}--disabled`)
    return (
      <div className={dropdownCls} style={style} ref={this.refDropdown}>
        <DropdownButton
          {...this.getPopperShowHandler()}
          {...this.getPopperHideHandler()}
          type={type}
          theme={theme}
          visible={visible}
          onButtonClick={onButtonClick}
          disabled={disabled}
        >
          {title}
        </DropdownButton>
        <DropdownMenu
          theme={theme}
          visible={visible}
          attachEle={this.refDropdown.current}
          data={data}
          placement={placement}
          onMouseEnter={this.handleMenuMouseEnter}
          onMouseLeave={this.handleMenuMouseLeave}
          onChildMenuMouseEnter={this.handleChildMenuMouseEnter}
          onChildMenuMouseLeave={this.handleChildMenuMouseLeave}
          onMenuItemClick={this.handleMenuItemClick}
          width={width}
        />
      </div>
    )
  }
}

Dropdown.propTypes = {
  placement: PropTypes.oneOf(['top-start', 'bottom-start', 'top', 'bottom', 'bottom-end', 'top-end']),
  trigger: PropTypes.oneOfType([
    PropTypes.oneOf(['contextmenu', 'click', 'hover']),
    PropTypes.arrayOf(PropTypes.oneOf(['contextmenu', 'click', 'hover']))
  ]),
  onClick: PropTypes.func,
  data: propTypesOfMenuData,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  width: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object
}

Dropdown.defaultProps = {
  placement: 'bottom-start',
  trigger: 'hover',
  width: 240
}
export default Provider(Dropdown)
export {Dropdown}
