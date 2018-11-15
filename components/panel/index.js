import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

class Panel extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    icon: PropTypes.string,
    type: PropTypes.string
  }
  static defaultProps = {
    prefixCls: 'hi-panel',
    type: 'info'
  }
  render () {
    let classnames = classNames(this.props.prefixCls, this.props.type)
    const { title, footer, children, icon } = this.props

    return (
      <div className={classnames}>
        <div className='panel-title'>
          {
            icon && <i className={classNames('hi-icon', icon)} />
          }
          {title}
        </div>
        <div className='panel-content'>{children}</div>
        {
          typeof footer !== 'undefined' && (
            <div className='panel-footer'>{footer}</div>
          )
        }
      </div>
    )
  }
}

export default Panel
