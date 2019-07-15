import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style'
import { BarProgress } from './BarProgress.js'
import { CircleProgress } from './CircleProgress.js'
import { DashboardProgress } from './DashboardProgress'

class Progress extends Component {
  static propTypes = {
    apperance: PropTypes.string,
    type: PropTypes.oneOf(['success', 'warn', 'error', 'primary']),
    percent: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    size: PropTypes.oneOf(['large', 'default', 'small'])
  }
  static defaultProps = {
    apperance: 'bar',
    size: 'default',
    percent: 0,
    radius: 40,
    type: 'primary',
    showInfo: true,
    placement: 'outside'
  }

  getRenderType (apperance) {
    switch (apperance) {
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
    const { className = '', apperance } = this.props

    return (
      <div className={`${prefix}__container ${className}`}>{this.getRenderType(apperance)}</div>
    )
  }
}
export default Progress
