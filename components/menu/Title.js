import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Icon from '../icon'

class Title extends Component {
  renderIcon (icon) {
    if (!icon) {
      icon = null
    }
    if (typeof icon === 'string') {
      icon = <Icon name={icon} />
    }

    return (
      icon
        ? (<div className='hi-menu__title-icon'>
          {icon}
        </div>) : null
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

Title.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}
export default Title
