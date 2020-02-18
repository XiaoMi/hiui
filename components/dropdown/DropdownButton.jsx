import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Button from '../button'
import { prefixCls } from '.'

const ButtonGroup = Button.Group

export default class DropdownButton extends React.Component {
  render () {
    const {
      children,
      type,
      onIconClick,
      visible,
      onButtonClick,
      ...restProps
    } = this.props
    const isButton = ['button', 'group'].includes(type)
    const isGroup = type === 'group'
    const buttonCls = classNames(
      `${prefixCls}__button`,
      isButton || `${prefixCls}__button--text`,
      visible && `${prefixCls}__button--active`
    )
    const iconGroupCls = classNames(
      `${prefixCls}__icon`,
      isButton || `${prefixCls}__icon--text`,
      isButton && `${prefixCls}__icon-btnwrap`
    )
    const iconCls = classNames('hi-icon', 'icon-down', `${prefixCls}__icon`, {
      'not-group': isButton && !isGroup
    })
    isButton || (restProps.appearance = 'link')
    const iconProps = {}
    // move button events to icon
    if (isGroup) {
      iconProps.onContextMenu = restProps.onContextMenu
      iconProps.onMouseEnter = restProps.onMouseEnter
      iconProps.onMouseLeave = restProps.onMouseLeave
      iconProps.onClick = restProps.onClick
      iconProps.disabled = restProps.disabled
      Reflect.deleteProperty(restProps, 'onContextMenu')
      Reflect.deleteProperty(restProps, 'onMouseEnter')
      Reflect.deleteProperty(restProps, 'onMouseLeave')
      Reflect.deleteProperty(restProps, 'onClick')
      restProps.onClick = onButtonClick
    }
    return (
      <ButtonGroup>
        <Button {...restProps} className={buttonCls}>
          {children}
          {isGroup || <i className={iconCls} />}
        </Button>
        {isGroup && (
          <Button
            appearance={isButton ? 'button' : 'link'}
            className={iconGroupCls}
            {...iconProps}
          >
            <i className={iconCls} />
          </Button>
        )}
      </ButtonGroup>
    )
  }
}

DropdownButton.propTypes = {
  type: PropTypes.oneOf(['text', 'group', 'button']),
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func
}

DropdownButton.defaultProps = {}
