import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Popper from '../popper'
import './style/index'

export default class Popover extends Component {
  unbindHover = true

  static defaultProps = {
    trigger: 'click',
    placement: 'top',
    width: 'auto'
  }

  static propTypes = {
    placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    trigger: PropTypes.oneOf(['click', 'focus', 'hover']),
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    content: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    width: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.state = {
      showPopper: false
    }
    this.eventTarget = null
    this.popperRef = React.createRef()
    this.referenceRef = null
  }

  showPopper () {
    this.setState({
      showPopper: true
    })
  }
  hidePopper () {
    this.setState({
      showPopper: false
    })
  }
  delayHidePopper (e) {
    setTimeout(() => {
      if (this.eventTarget !== e.target && this.isInPopover()) return
      this.hidePopper()
    }, 200)
  }

  isInPopover () {
    const popper = this.popperRef.current
    const referenceRef = ReactDOM.findDOMNode(this.referenceRef)
    const bool = !this.element || this.element.contains(this.eventTarget) ||
            !referenceRef || referenceRef.contains(this.eventTarget) ||
            !popper || popper.contains(this.eventTarget)
    this.eventTarget = null
    return bool
  }

  componentDidMount () {
    const { trigger } = this.props

    this.element = ReactDOM.findDOMNode(this)
    const referenceRef = ReactDOM.findDOMNode(this.referenceRef)
    if (referenceRef === null) return

    if (trigger === 'click') {
      referenceRef.addEventListener('click', () => {
        if (this.state.showPopper) {
          this.hidePopper()
        } else {
          this.showPopper()
        }
      })

      document.addEventListener('click', (e) => {
        this.eventTarget = e.target
        if (this.isInPopover()) return

        this.hidePopper()
      })
    } else if (trigger === 'hover') {
      referenceRef.addEventListener('mouseenter', e => {
        this.eventTarget = e.target
        this.showPopper()
      })
      referenceRef.addEventListener('mouseleave', e => {
        this.delayHidePopper(e)
      })
    } else {
      referenceRef.addEventListener('focus', this.showPopper.bind(this))
      referenceRef.addEventListener('blur', this.hidePopper.bind(this))
    }
  }

  componentDidUpdate () {
    const { trigger } = this.props
    const popper = this.popperRef

    if (popper.current && trigger === 'hover' && this.unbindHover) {
      this.unbindHover = false
      popper.current.addEventListener('mouseenter', e => {
        this.eventTarget = e.target
      })
      popper.current.addEventListener('mouseleave', e => {
        this.delayHidePopper(e)
      })
    }
  }

  render () {
    const { style, className, title, content, placement, width } = this.props
    const {
      showPopper
    } = this.state
    return (
      <div className={classNames(className, 'hi-popover')} style={style} ref={node => { this.popoverContainer = node }}>
        { React.cloneElement(React.Children.only(this.props.children), { ref: (el) => { this.referenceRef = el }, tabIndex: '0' }) }

        <Popper
          className='hi-popover__popper'
          show={[true, false].includes(this.props.visible) ? this.props.visible : showPopper}
          attachEle={this.popoverContainer}
          placement={placement}
          zIndex={1040}
          width={width}
        >
          <div ref={this.popperRef} className={classNames('hi-popover-base', `hi-popover-${placement}`)}>
            { title && <div className='hi-popover__title'>{title}</div> }
            <div className='hi-popover__content'>
              { content }
            </div>
          </div>
        </Popper>
      </div>
    )
  }
}
