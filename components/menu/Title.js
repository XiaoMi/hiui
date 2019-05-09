import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Icon from '../icon'

export default class Title extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  }

  renderIcon (icon) {
    if (!icon) {
      return null
    }
    let iconEle = icon
    if (typeof icon === 'string') {
      iconEle = <Icon name={icon} />
    }

    return (
      <div className='hi-menu__title-icon'>
        {iconEle}
      </div>
    )
  }

  render () {
    const {
      content,
      icon
    } = this.props

    return (
      <React.Fragment>
        {
          this.renderIcon(icon)
        }
        <div className='hi-menu__title-content'>
          {content}
        </div>
      </React.Fragment>
    )
  }
}
