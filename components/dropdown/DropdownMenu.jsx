import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Popper from '../popper'
import { prefixCls } from '.'
import DropdownMenuItem from './DropdownMenuItem'

class DropdownMenu extends React.Component {
  render() {
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
      handleDocumentClick,
      width,
      theme,
      overlayClassName
    } = this.props
    const menuCls = classNames(`${prefixCls}__menu`, `theme__${theme}`)
    return (
      <Popper
        className={`${prefixCls}__popper`}
        show={visible}
        attachEle={attachEle}
        // container={document.body}
        zIndex={1060}
        placement={placement}
        width={width}
        onMouseEnter={onMouseEnter}
        leftGap={0}
        topGap={5}
        overlayClassName={overlayClassName}
        onMouseLeave={onMouseLeave}
        onClickOutside={() => {
          handleDocumentClick && handleDocumentClick()
        }}
      >
        <ul className={menuCls}>
          {data.map((item, index) => (
            <DropdownMenuItem
              theme={theme}
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
export default DropdownMenu
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
