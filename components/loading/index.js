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
      <div className='hi-loading__mask'>
        <div className='hi-loading__outter'>
          <div className={`hi-loading__circle hi-loading__circle--${this.props.size}`}>
            <div className='sk-circle1 hi-loading__circle-item' />
            <div className='sk-circle2 hi-loading__circle-item' />
            <div className='sk-circle3 hi-loading__circle-item' />
            <div className='sk-circle4 hi-loading__circle-item' />
            <div className='sk-circle5 hi-loading__circle-item' />
            <div className='sk-circle6 hi-loading__circle-item' />
            <div className='sk-circle7 hi-loading__circle-item' />
            <div className='sk-circle8 hi-loading__circle-item' />
            <div className='sk-circle9 hi-loading__circle-item' />
            <div className='sk-circle10 hi-loading__circle-item' />
            <div className='sk-circle11 hi-loading__circle-item' />
            <div className='sk-circle12 hi-loading__circle-item' />
          </div>
          <div className='hi-loading__text'>{tip}</div>
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
