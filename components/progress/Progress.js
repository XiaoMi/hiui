import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style'
import BarProgress from './BarProgress.js'
import { CircleProgress } from './CircleProgress.js'
import { DashboardProgress } from './DashboardProgress'
import Provider from '../context'
class Progress extends Component {
  static propTypes = {
    apperance: PropTypes.string,
    type: PropTypes.oneOf(['success', 'warn', 'error', 'primary']),
    percent: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    size: PropTypes.oneOf(['large', 'default', 'small']),
    placement: PropTypes.oneOf(['inside', 'outside'])
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
    const { className = '', apperance, theme, type} = this.props
    const _apperance = apperance || type // api 兼容 1.x 为 type 2.x 改为 apperance

    return <div className={`${prefix}__container ${className} theme__${theme}`}>{this.getRenderType(_apperance)}</div>
  }
}
export default Provider(Progress)
