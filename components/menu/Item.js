import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Title from './Title'

class Item extends Component {
  static componentName = 'MenuItem'

  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    index: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    isActive: PropTypes.bool
  }

  static defaultProps = {
    disabled: false,
    isActive: false
  }

  render () {
    const {
      children,
      disabled,
      onClick,
      isActive,
      id,
      icon,
      index
    } = this.props
    const cls = classNames('hi-menu-item', 'hi-menu-item__title', 'hi-menu__title', {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': isActive
    })

    return (
      <li className={cls} onClick={() => {
        if (!disabled) {
          onClick(index, id)
        }
      }}>
        <Title icon={icon} content={children} />
      </li>
    )
  }
}

export default Item
