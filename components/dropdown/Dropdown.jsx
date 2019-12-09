import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import DropdownButton from './DropdownButton'
import DropdownMenu, { propTypesOfMenuData } from './DropdownMenu'
import { prefixCls } from '.'
import { getIsTriggerEqualHover, getIsTriggerEqualContextmenu, trimTriggers } from './utils'

export default class Dropdown extends React.Component {
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
    this.eventHandler(event)
    clearTimeout(this.timerHideMenu)
    this.setState({ visible: true })
  }
  setPopperHide = (event) => {
    this.eventHandler(event)
    this.setState({ visible: false })
  }
  setPopperDelayHide = (event) => {
    this.eventHandler(event)
    this.timerHideMenu = setTimeout(() => {
      this.setState({ visible: false })
    }, 200)
  }
  getPopperShowHandler = () => {
    const { disabled } = this.props
    if (disabled) return {}
    const { visible } = this.state
    const triggers = trimTriggers(this.props)
    const getHandler = (props) => {
      if (getIsTriggerEqualHover(props)) {
        return {
          onMouseEnter: this.setPopperShow
        }
      }
      const toggleVisible = visible ? this.setPopperHide : this.setPopperShow
      if (getIsTriggerEqualContextmenu(props)) {
        return {
          onContextMenu: toggleVisible
        }
      }
      return {
        onClick: toggleVisible
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
  handleMenuItemClick = (data) => {
    console.log('click', data)
    const { onClick } = this.props
    this.setPopperDelayHide()
    onClick && onClick(data)
  }
  handleDocumentClick = () => {
    this.setState({ visible: false })
  }
  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick)
  }
  componentWillUnmount () {
    document.removeEventListener('click', this.handleDocumentClick)
  }
  render () {
    const { className, style, title, type, placement, data, disabled, width, onButtonClick } = this.props
    const { visible } = this.state
    const dropdownCls = classNames(prefixCls, prefixCls + '--' + type, className, disabled && `${prefixCls}--disabled`)
    return (
      <div className={dropdownCls} style={style} ref={this.refDropdown}>
        <DropdownButton
          {...this.getPopperShowHandler()}
          {...this.getPopperHideHandler()}
          type={type}
          visible={visible}
          onButtonClick={onButtonClick}
          disabled={disabled}
        >
          {title}
        </DropdownButton>
        <DropdownMenu
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
  placement: PropTypes.oneOf(['top-start', 'bottom-start', 'top', 'bottom']),
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
