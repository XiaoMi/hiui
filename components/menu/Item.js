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
    activeIndex: PropTypes.string
  }

  static defaultProps = {
    disabled: false,
    activeIndex: ''
  }

  render () {
    const {
      children,
      disabled,
      onClick,
      activeIndex,
      id,
      icon,
      index
    } = this.props
    const isActive = activeIndex.indexOf(index) === 0
    const cls = classNames('hi-menu-item', 'hi-menu-item__title', 'hi-menu__title', {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': isActive
    })

    return (
      <li className={cls} onClick={e => {
        e.stopPropagation()
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
