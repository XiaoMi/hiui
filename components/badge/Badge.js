import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

class Badge extends Component {
  static propTypes = {
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOf(['bubble', 'dot']),
    max: PropTypes.number,
    visible: PropTypes.bool,
    style: PropTypes.object
  }

  static defaultProps = {
    prefixCls: 'hi-badge',
    style: {},
    content: '',
    type: 'bubble',
    max: 99,
    visible: true
  }

  render () {
    const { content, prefixCls, max, type, visible, style } = this.props
    const eleClass = classNames(`${prefixCls}-base`)
    return (
      <div className={eleClass} style={style}>
        {this.props.children}
        {type === 'dot' ? (
          <span className={`${prefixCls}-dot${!visible ? ' hi-hide' : ''}`} />
        ) : (
          <sup className={`${prefixCls}-value${!visible ? ' hi-hide' : ''}`}>
            {typeof content === 'number' ? (content > max ? max + '+' : content) : content}
          </sup>
        )}
      </div>
    )
  }
}

export default Badge
