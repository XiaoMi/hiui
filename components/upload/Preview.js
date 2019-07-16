import React, { Component } from 'react'
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
          </div>
          <div className='hi-preview__close' onClick={this.onClose.bind(this)}>
            <Icon name='close-circle' />
          </div>

        </div>
      </ReactCSSTransitionGroup>
    )
  }
}
Preview.propTypes = {
  src: PropTypes.string,
  show: PropTypes.bool,
  onClose: PropTypes.func
}

export default Preview
