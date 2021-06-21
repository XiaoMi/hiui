import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Popper from '../popper'
import './style/index'
export default class Popover extends Component {
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
  constructor(props) {
    super(props)
    this.state = {
      showPopper: false
    }
    this.eventTarget = null
    this.popperRef = React.createRef()
    this.referenceRef = null
    this.delayHidePopperTimer = null
  }

  showPopper() {
    this.setState({
      showPopper: true
    })
  }
  hidePopper() {
    this.setState({
      showPopper: false
    })
  }
  delayHidePopper(e) {
    this.delayHidePopperTimer = setTimeout(() => {
      if (this.eventTarget !== e.target && this.isInPopover()) return
      this.hidePopper()
    }, 200)
  }

  delayShowPopper(e) {
    this.delayShowPopperTimer = setTimeout(() => {
      this.showPopper()
    }, 200)
  }

  isInPopover() {
    const popper = this.popperRef.current
    const referenceRef = ReactDOM.findDOMNode(this.referenceRef)
    const bool =
      !this.element ||
      this.element.contains(this.eventTarget) ||
      !referenceRef ||
      referenceRef.contains(this.eventTarget) ||
      !popper ||
      popper.contains(this.eventTarget)
    this.eventTarget = null
    return bool
  }

  handlePopperMouseOver = () => {
    const { trigger } = this.props
    if (trigger === 'hover') {
      this.showPopper()
      clearTimeout(this.delayHidePopperTimer)
    }
  }

  handlePopperMouseLeave = () => {
    const { trigger } = this.props
    if (trigger === 'hover') {
      this.hidePopper()
    }
  }

  componentDidMount() {
    const { trigger } = this.props

    this.element = ReactDOM.findDOMNode(this)
    const referenceRef = ReactDOM.findDOMNode(this.referenceRef)

    if (referenceRef === null) return

    if (trigger === 'click' || trigger === 'focus') {
      referenceRef.addEventListener('click', () => {
        if(trigger === 'focus'){
          referenceRef.contains(document.activeElement) ? this.showPopper() : this.hidePopper()
        } else {
          this.state.showPopper ? this.hidePopper() : this.showPopper()
        } 
      })

      document.addEventListener('click', (e) => {
        this.eventTarget = e.target
        if (this.isInPopover()) return

        this.hidePopper()
      })
    } else if (trigger === 'hover') {
      referenceRef.addEventListener('mouseenter', (e) => {
        this.eventTarget = e.target
        this.delayShowPopper(e)
      })
      referenceRef.addEventListener('mouseleave', (e) => {
        this.delayHidePopper(e)
        clearTimeout(this.delayShowPopperTimer)
      })
    } 
  }
  render() {
    const { style, className, title, content, placement, width, visible, overlayClassName, children } = this.props
    const { showPopper } = this.state
    
    return (
      <div
        className={classNames(className, 'hi-popover')}
        style={style}
        ref={(node) => {
          this.popoverContainer = node
          this.referenceRef = node
        }}
      >
        {children}
        <Popper
          className='hi-popover__popper'
          show={[true, false].includes(visible) ? visible : showPopper}
          attachEle={this.popoverContainer}
          placement={placement}
          zIndex={1040}
          width={width}
          overlayClassName={overlayClassName}
          onMouseOver={this.handlePopperMouseOver}
          onMouseLeave={this.handlePopperMouseLeave}
        >
          <div ref={this.popperRef} className={classNames('hi-popover-base', `hi-popover-${placement}`)}>
            {title && <div className='hi-popover__title'>{title}</div>}
            <div className='hi-popover__content'>{content}</div>
          </div>
        </Popper>
      </div>
    )
  }
}
