import React, { Component } from 'react'
import {createPortal} from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import './style/preview.js'

class Preview extends Component {
  constructor (props) {
    super(props)
    this.state = {
      extraClass: '',
      style: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
        rotate: 0,
        scaleX: 1,
        scaleY: 1
      },
      compileStyle: {
      },
      imgLoaded: false,
      isLoaded: false,
      isMouseDown: false,
      mouseX: 0,
      mouseY: 0,
      zoomValue: 100,
      rotateValue: 0,
      activeIndex: props.activeIndex || 0
    }
    this.node = document.createElement('div')
    document.body.appendChild(this.node)
    this.imgRef = React.createRef()
    this.previewRef = React.createRef()
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseWheel = this.handleMouseWheel.bind(this)
  }

  componentDidMount () {
    this.loadImg(this.state.activeIndex)
    this.previewRef.current.addEventListener('mousewheel', this.handleMouseWheel, false)
    this.previewRef.current.addEventListener('DOMMouseScroll', this.handleMouseWheel, false)
  }
  componentWillUnmount () {
    this.previewRef.current.removeEventListener('mousewheel', this.handleMouseWheel, false)
    this.previewRef.current.removeEventListener('DOMMouseScroll', this.handleMouseWheel, false)
  }
  // static getDerivedStateFromProps (nextProps, prevState) {
  //   const { activeIndex } = nextProps
  //   if (nextProps.activeIndex !== prevState.activeIndex) {
  //     return {
  //       activeIndex
  //     }
  //   }
  //   return null
  // }
  onClose (e) {
    this.setState({
      style: {},
      extraClass: '',
      imgLoaded: false
    })
    this.props.onClose && this.props.onClose()
  }
  handleMouseWheel (e) {
    e = e || window.event
    e.preventDefault()
    e.stopPropagation()
    let direct
    let delta = 0
    if (e.wheelDelta) {
      delta = e.wheelDelta
      if (window.opera) delta = -delta
    } else if (e.detail) {
      delta = -e.detail
    }
    if (delta === 0) {
      direct = 0
    } else {
      direct = delta > 0 ? -1 : 1
    }
    if (direct !== 0) {
      let x = e.clientX
      let y = e.clientY
      this.handleZoom(x, y, direct)
    }
  }
  handleMouseDown (e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      isMouseDown: true,
      mouseX: e.nativeEvent.clientX,
      mouseY: e.nativeEvent.clientY
    })
  }
  handleMouseUp () {
    this.setState({isMouseDown: false})
  }
  handleMouseMove (e) {
    if (this.state.isMouseDown) {
      let diffX = e.clientX - this.state.mouseX
      let diffY = e.clientY - this.state.mouseY
      this.setState({
        mouseX: e.clientX,
        mouseY: e.clientY
      })
      this.changeImageState({
        left: this.state.style.left + diffX,
        top: this.state.style.top + diffY
      })
    }
  }
  handleZoom (x, y, direct) {
    const speed = 0.05
    let imgCenterXY = this.getImageCenterXY()
    let diffX = x - imgCenterXY.x
    let diffY = y - imgCenterXY.y
    let {left, top, scaleX, scaleY} = this.state.style
    let directX = scaleX > 0 ? 1 : -1
    let directY = scaleY > 0 ? 1 : -1
    const _scaleX = scaleX + speed * direct * directX
    const _scaleY = scaleY + speed * direct * directY
    if (Math.abs(_scaleX) < 0.1 || Math.abs(_scaleY) < 0.1) {
      return
    }
    this.changeImageState({
      scaleX: _scaleX,
      scaleY: _scaleY,
      top: top + -direct * diffY / scaleX * speed * directX,
      left: left + -direct * diffX / scaleY * speed * directY
    })
  }
  handleRotate (isRight) {
    const { rotate } = this.state.style
    this.changeImageState({
      rotate: rotate + 90 * (isRight ? 1 : -1)
    })
  }
  getImageCenterXY () {
    const { left, top, width, height } = this.state.style
    return {
      x: left + width / 2,
      y: top + height / 2
    }
  }
  changeImageState (args) {
    const { style } = this.state
    const _style = Object.assign({}, style, {...args})
    this.setState({
      style: _style
    }, () => {
      const compileStyle = {
        width: _style.width,
        height: _style.height,
        transform: `translateX(${_style.left}px) translateY(${_style.top}px) rotate(${_style.rotate}deg) scaleX(${_style.scaleX}) scaleY(${_style.scaleY})`
      }
      this.setState({
        compileStyle,
        isLoaded: true
      })
    })
  }
  loadImg (imageIndex) {
    const { images } = this.props
    if (!images || images.length === 0) {
      return
    }
    if (imageIndex >= images.length) {
      imageIndex = 0
    }
    if (imageIndex < 0) {
      imageIndex = images.length - 1
    }
    this.setState({activeIndex: imageIndex})
    const currentImage = images[imageIndex]
    const img = new window.Image()
    img.onload = () => {
      this.getImgWidthHeight(img.width, img.height)
    }
    img.src = currentImage.url
  }
  getImgWidthHeight (imgWidth, imgHeight) {
    let width = 0
    let height = 0
    const { innerHeight, innerWidth } = window
    let maxWidth = innerWidth * 0.8
    let maxHeight = innerHeight * 0.8
    let style = {}
    width = Math.min(maxWidth, imgWidth)
    height = width / imgWidth * imgHeight
    if (height > maxHeight) {
      height = maxHeight
      width = height / imgHeight * imgWidth
    }
    style = {
      width,
      height,
      left: (innerWidth - width) / 2,
      top: (innerHeight - height) / 2,
      scaleX: 1,
      scaleY: 1,
      rotate: 0
    }
    this.changeImageState(style)
  }
  clickEvent (type, event) {
    event.stopPropagation()
    let { activeIndex } = this.state
    const {x, y} = this.getImageCenterXY()
    switch (type) {
      case 'zoomIn':
        this.handleZoom(x, y, 1)
        break
      case 'zoomOut':
        this.handleZoom(x, y, -1)
        break
      case 'reset':
        this.loadImg(activeIndex)
        break
      case 'leftRotate':
        this.handleRotate()
        break
      case 'rightRotate':
        this.handleRotate(true)
        break
      case 'prev':
        this.loadImg(activeIndex - 1)
        break
      case 'next':
        this.loadImg(activeIndex + 1)
        break
      case 'close':
        this.onClose()
        break
      default:
        break
    }
  }

  render () {
    const { show, images } = this.props
    const {
      extraClass,
      compileStyle,
      isLoaded,
      activeIndex
    } = this.state
    return (
      createPortal(
        <ReactCSSTransitionGroup
          transitionName='hi-preview'
          transitionEnterTimeout={50}
          transitionLeaveTimeout={50}
          component='div'
        >
          <div
            key={1}
            ref={this.previewRef}
            className={classNames('hi-preview', extraClass, {'hi-preview--hide': !show})}
            onMouseMove={this.handleMouseMove}
          >
            {
              isLoaded && <img
                ref={this.imgRef}
                src={images[activeIndex].url}
                style={{...compileStyle}}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                className='hi-preview__image'
              />
            }
            <div className='hi-preview-toolbar' onClick={(e) => { e.stopPropagation() }}>

              <Icon name='zoom-out' onClick={this.clickEvent.bind(this, 'zoomIn')} />
              <Icon name='zoom-in' onClick={this.clickEvent.bind(this, 'zoomOut')} />
              <Icon name='left' onClick={this.clickEvent.bind(this, 'prev')} />
              <Icon name='ratio' onClick={this.clickEvent.bind(this, 'reset')} />
              <Icon name='right' onClick={this.clickEvent.bind(this, 'next')} />
              <Icon name='rotate-left' onClick={this.clickEvent.bind(this, 'leftRotate')} />
              <Icon name='rotate-right' onClick={this.clickEvent.bind(this, 'rightRotate')} />
              {/* <Icon name='close-circle-o' onClick={this.clickEvent.bind(this, 'close')} /> */}
            </div>
            <div className='hi-preview__close' onClick={this.onClose.bind(this)}>
              <img src='data:image/png;base64,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' />
            </div>

          </div>
        </ReactCSSTransitionGroup>,
        this.node
      )
    )
  }
}
Preview.propTypes = {
  src: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func
}

export default Preview
