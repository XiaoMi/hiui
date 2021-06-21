import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Icon from '../icon'

class Title extends Component {
  renderIcon (icon) {
    const { level, placement, mini, content } = this.props
    if (!icon) {
      icon = null
    }
    if (typeof icon === 'string') {
      icon = <Icon name={icon} />
    }
    return icon || (level === 1 && placement === 'vertical' && mini) ? (
      <div className='hi-menu__title-icon'>{icon || content.substring(0, 1)}</div>
    ) : null
  }

  render () {
    const { content, icon } = this.props

    return (
      <React.Fragment>
        {this.renderIcon(icon)}
        <div className='hi-menu__title-content'>{content}</div>
      </React.Fragment>
    )
  }
}

Title.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}
export default Title
