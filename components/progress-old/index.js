import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style'
import {BarProgress} from './BarProgress.js'
import {CircleProgress} from './CircleProgress.js'
import {DashboardProgress} from './DashboardProgress'

class Progress extends Component {
  static propTypes = {
    type: PropTypes.string,
    status: PropTypes.oneOf(['success', 'warn', 'error', 'primary']),
    percent: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    size: PropTypes.oneOf(['big', 'large', 'middle', 'small'])
  }
  static defaultProps = {
    type: 'bar',
    size: 'large',
    percent: 0,
    radius: 40,
    status: 'primary'
  }

  getRenderType (type) {
    switch (type) {
      case 'circle':
        return <CircleProgress {...this.props} />
      case 'dashboard':
        return <DashboardProgress {...this.props} />
      default:
        return <BarProgress {...this.props} />
    }
  }

  render () {
    let prefix = 'hi-progress'
    const {className = '', type} = this.props

    return (
      <div className={`${prefix}__container ${className}`}>
        {this.getRenderType(type)}
      </div>
    )
  }
}
export default Progress
