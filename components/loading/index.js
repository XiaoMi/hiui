import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style/index'
export default class Loading extends Component {
  static defaultProps = {
    size: 'default'
  }
  static propTypes = {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    full: PropTypes.bool,
    show: PropTypes.bool,
    tip: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      noramLoading: false
    }
  }
  componentDidMount () {
    this.props.full && document.body.style.setProperty('overflow', 'hidden')
    if (!this.props.children) {
      this.setState({
        noramLoading: true
      })
    }
  }
  componentWillUnmount () {
    document.body.style.removeProperty('overflow')
  }
  renderCircle (tip) {
    return (
      <div className='hi-loading-mask'>
        <div className='hi-loading-outter'>
          <div className={`sk-circle sk-circle-${this.props.size}`}>
            <div className='sk-circle1 sk-child' />
            <div className='sk-circle2 sk-child' />
            <div className='sk-circle3 sk-child' />
            <div className='sk-circle4 sk-child' />
            <div className='sk-circle5 sk-child' />
            <div className='sk-circle6 sk-child' />
            <div className='sk-circle7 sk-child' />
            <div className='sk-circle8 sk-child' />
            <div className='sk-circle9 sk-child' />
            <div className='sk-circle10 sk-child' />
            <div className='sk-circle11 sk-child' />
            <div className='sk-circle12 sk-child' />
          </div>
          <div className='hi-loading-text'>{tip}</div>
        </div>
      </div>
    )
  }
  render () {
    let {full, show, tip} = this.props
    const {noramLoading} = this.state
    let style = {}
    if (full) {
      style = {
        position: 'fixed',
        bottom: 0,
        right: 0
      }
    }
    return (
      <div className='hi-loading' style={style}>
        {(show || full || noramLoading) && this.renderCircle(tip)}
        {this.props.children}
      </div>
    )
  }
}
