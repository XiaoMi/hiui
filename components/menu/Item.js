import React, {Component} from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

class Item extends Component {
  static componentName = 'MenuItem'

  static propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool
  }

  static defaultProps = {
    disabled: false
  }

  render () {
    const {
      children,
      disabled,
      onClick,
      activeId,
      id
    } = this.props
    const cls = classNames('hi-menu-item', {
      'hi-menu-item--disabled': disabled,
      'hi-menu-item--active': activeId === id
    })

    return (
      <li className={cls} onClick={() => {
        if (!disabled) {
          onClick(id)
        }
      }}>
        <div className='hi-menu-item__title'>
          {children}
        </div>
      </li>
    )
  }
}

export default Item
