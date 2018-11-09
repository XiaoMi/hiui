import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './style/index'

class Badge extends Component {
  static propTypes = {
    value: PropTypes.string | PropTypes.number,
    dot: PropTypes.bool,
    max: PropTypes.number,
    hidden: PropTypes.bool,
    style: PropTypes.object
  }

  static defaultProps = {
    prefixCls: 'hi-badge',
    style: {},
    value: '',
    dot: false,
    max: 99,
    hidden: false
  }

  render () {
    const {value, prefixCls, max, dot, hidden, style} = this.props
    const eleClass = classNames(`${prefixCls}-base`)
    return (
      <div className={eleClass} style={style}>
        {
          dot
            ? (
              <span className={`${prefixCls}-dot${hidden ? ' hi-hide' : ''}`} />
            )
            : (
              <span className={`${prefixCls}-value${hidden ? ' hi-hide' : ''}`}>
                {
                  typeof +value === 'number'
                    ? (
                      +value > max ? max + '+' : value
                    )
                    : value
                }
              </span>
            )
        }
        {this.props.children}
      </div>
    )
  }
}

export default Badge
