import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Item extends Component {
  static componentName = 'MenuItem'

  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
      indexs
    } = this.props
    const cls = classNames('hi-menu-item', {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': isActive
    })

    return (
      <li className={cls} onClick={() => {
        if (!disabled) {
          onClick(indexs, id)
        }
      }}>
        <div className='hi-menu-item__content'>
          {children}
        </div>
      </li>
    )
  }
}

export default Item
