import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import './style/index'
class Loading extends Component {
  static defaultProps = {
    size: 'default'
  }
  static instanceKey = new Date().getTime().toString()
  static propTypes = {
    size: PropTypes.oneOf(['large', 'default', 'small']),
    full: PropTypes.bool,
    show: PropTypes.bool,
    tip: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      noramLoading: false,
      width: document.body.clientWidth || document.documentElement.clientWidth,
      height: document.body.clientHeight || document.documentElement.clientHeight
    }
  }
  componentDidMount () {
    (this.props.full || (this.props.service && !this.props.target)) && document.body.style.setProperty('overflow', 'hidden')
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
            {
              new Array(12).fill(0).map((item, index) => <div className='hi-loading__circle-item' key={index} />)
            }
          </div>
          <div className='hi-loading__text'>{tip}</div>
        </div>
      </div>
    )
  }
  render () {
    let {full, show, tip, target, service} = this.props
    const {noramLoading, width, height} = this.state
    let style = {}
    if (full || (!target && service)) {
      style = {
        position: 'fixed',
        bottom: 0,
        right: 0,
        width,
        height
      }
    }

    if (target) {
      const rect = target.getBoundingClientRect()
      const st = document.documentElement.scrollTop || document.body.scrollTop
      const sl = document.documentElement.scrollLeft || document.body.scrollLeft
      style = {
        position: 'absolute',
        width: rect.width,
        left: rect.left + sl,
        top: rect.top + st,
        height: rect.height
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

Loading.newInstance = function newNotificationInstance (properties) {
  let props = properties || {}
  let div = document.createElement('div')
  document.body.appendChild(div)
  ReactDOM.render(React.createElement(Loading, props), div)
  return {
    close () {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

Loading.open = (arg) => {
  return Loading.newInstance({
    ...arg,
    service: true
  })
}
export default Loading
