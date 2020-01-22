import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import { prefixCls } from '.'
import DropdownMenuItem from './DropdownMenuItem'

export default class DropdownMenu extends React.Component {
  render () {
    const {
      data,
      attachEle,
      visible,
      placement,
      onMouseEnter,
      onMouseLeave,
      onChildMenuMouseEnter,
      onChildMenuMouseLeave,
      onMenuItemClick,
      width,
      theme
    } = this.props
    const menuCls = classNames(`${prefixCls}__menu`, `theme__${theme}`)
    return (
      <Popper
        className={`${prefixCls}__popper`}
        show={visible}
        attachEle={attachEle}
        zIndex={1060}
        placement={placement}
        width={width}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ul className={menuCls}>
          {data.map((item, index) => (
            <DropdownMenuItem
              key={index}
              {...item}
              parentPopperVisible={visible}
              onChildMenuMouseEnter={onChildMenuMouseEnter}
              onChildMenuMouseLeave={onChildMenuMouseLeave}
              onMenuItemClick={onMenuItemClick}
              width={width}
            />
          ))}
        </ul>
      </Popper>
    )
  }
}

export const propTypesOfMenuData = PropTypes.arrayOf(
  PropTypes.shape({
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    onClick: PropTypes.func,
    prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    suffix: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    url: PropTypes.string
  })
)

DropdownMenu.propTypes = {
  data: propTypesOfMenuData
}

DropdownMenu.defaultProps = {
  data: []
}
