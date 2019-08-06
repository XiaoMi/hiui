import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Title from './Title'

class Item extends Component {
  render () {
    const {
      children,
      disabled,
      onClick,
      level,
      activeIndex,
      id,
      icon,
      index,
      data
    } = this.props
    const isActive = activeIndex.indexOf(index) === 0
    const cls = classNames('hi-menu-item', 'hi-menu-item__title', 'hi-menu__title', `hi-menu--${level}`, {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': isActive
    })
    return (
      <li className={cls} key={index} onClick={e => {
        e.stopPropagation()
        if (!disabled) {
          onClick(index, id, data)
        }
      }}>
        <Title icon={icon} content={children} />
      </li>
    )
  }
}

Item.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  level: PropTypes.number,
  index: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  activeIndex: PropTypes.string
}
Item.defaultProps = {
  disabled: false,
  activeIndex: ''
}
export default Item
