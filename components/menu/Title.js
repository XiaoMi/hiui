import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Icon from '../icon'

class Title extends Component {
  renderIcon (icon) {
    if (!icon) {
      icon = <i />
    }
    console.log(icon)
    if (typeof icon === 'string') {
      icon = <Icon name={icon} />
    }

    return (
      <div className='hi-menu__title-icon'>
        {icon}
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

Title.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}
export default Title
