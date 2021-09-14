import React, { useRef, useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import classNames from 'classnames'
import Icon from '../icon'
import Loading from '../loading'
import './style/index.js'
const node = document.createElement('div')
document.body.appendChild(node)
const Preview = ({
  className,
  visible: propsvisible,
  simpleData,
  images,
  activeIndex: propsActiveIndex = 0,
  duration,
  showBar = true,
  onClose: propsOnClose,
  showArrow,
  showCount,
  onError
}) => {
  if (images.length === 0 || !propsvisible) {
    return null
  }
  const previewRef = useRef()
  const imgRef = useRef()
  const [isLoaded, setIsLoaded] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMouseDown, setIsMouseDown] = useState(false)
  const [mouseCoord, setMouseCoord] = useState({ mouseX: 0, mouseY: 0 })
  const [activeIndex, setactiveIndex] = useState(propsActiveIndex)
  const [style, setStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    rotate: 0,
    scaleX: 1,
    scaleY: 1
  })
  const [compileStyle, setCompileStyle] = useState({})
  const autoPlayTimer = useRef(null)

  useEffect(() => {
    setVisible(propsvisible)
  }, [propsvisible])

  useEffect(() => {
    setactiveIndex(propsActiveIndex)
  }, [propsActiveIndex])

  /**
   * 修改图片样式
   * @param {*} args 计算后的部分样式
   */
  const changeImageState = useCallback(
    (args) => {
      setStyle({ ...Object.assign({}, style, { ...args }) })
    },
    [style]
  )

  useEffect(() => {
    if (isLoaded) {
      const compileStyle = {
        width: style.width,
        height: style.height,
        transform: `translateX(${style.left}px) translateY(${style.top}px) rotate(${style.rotate}deg) scaleX(${style.scaleX}) scaleY(${style.scaleY})`
      }
      setCompileStyle({
        ...compileStyle
      })
    }
  }, [style, isLoaded])

  const handleMouseMove = useCallback(
    (e) => {
      if (isMouseDown) {
        const diffX = e.clientX - mouseCoord.mouseX
        const diffY = e.clientY - mouseCoord.mouseY
        setMouseCoord({
          mouseX: e.clientX,
          mouseY: e.clientY
        })
        changeImageState({
          left: style.left + diffX,
          top: style.top + diffY
        })
      }
    },
    [isMouseDown, mouseCoord, changeImageState]
  )
  const getImageCenterXY = useCallback(() => {
    const { left, top, width, height } = style
    return {
      x: left + width / 2,
      y: top + height / 2
    }
  }, [style])
  /**
   * 缩放事件
   * @param {*} x 鼠标位置 x
   * @param {*} y 鼠标位置 y
   * @param {*} direct 方向
   */
  const handleZoom = useCallback(
    (x, y, direct) => {
      const speed = 0.05
      const imgCenterXY = getImageCenterXY()
      const diffX = x - imgCenterXY.x
      const diffY = y - imgCenterXY.y
      const { left, top, scaleX, scaleY } = style
      const directX = scaleX > 0 ? 1 : -1
      const directY = scaleY > 0 ? 1 : -1
      const _scaleX = scaleX + speed * direct * directX
      const _scaleY = scaleY + speed * direct * directY
      if (Math.abs(_scaleX) < 0.1 || Math.abs(_scaleY) < 0.1) {
        return
      }
      changeImageState({
        scaleX: _scaleX,
        scaleY: _scaleY,
        top: top + ((-direct * diffY) / scaleX) * speed * directX,
        left: left + ((-direct * diffX) / scaleY) * speed * directY
      })
    },
    [getImageCenterXY, changeImageState]
  )
  const handleMouseWheel = useCallback(
    (e) => {
      const direct = e.deltaY > 0 ? 1 : -1
      if (direct !== 0 && e.deltaY !== 0) {
        const x = e.clientX
        const y = e.clientY
        handleZoom(x, y, direct)
      }
    },
    [handleZoom]
  )
  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setIsMouseDown(true)
      setMouseCoord({
        mouseX: e.nativeEvent.clientX,
        mouseY: e.nativeEvent.clientY
      })
    },
    [isMouseDown, mouseCoord]
  )
  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false)
  }, [isMouseDown])
  const imageMouseOver = useCallback(() => {
    clearInterval(autoPlayTimer.current)
  }, [])
  const getImgWidthHeight = useCallback(
    (imgWidth, imgHeight) => {
      let width = 0
      let height = 0
      const { innerHeight, innerWidth } = window
      const maxWidth = innerWidth * 0.8
      const maxHeight = innerHeight * 0.8
      let style = {}
      width = Math.min(maxWidth, imgWidth)
      height = (width / imgWidth) * imgHeight
      if (height > maxHeight) {
        height = maxHeight
        width = (height / imgHeight) * imgWidth
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
      changeImageState(style)
    },
    [style]
  )
  /**
   * 加载图片 加载完成后生成计算样式
   * @param {*} imageIndex 加载的图片索引
   */
  const loadImg = useCallback(
    (imageIndex) => {
      if (!images || images.length === 0) {
        return
      }
      if (imageIndex >= images.length) {
        imageIndex = 0
      }
      if (imageIndex < 0) {
        imageIndex = images.length - 1
      }
      const currentImage = images[imageIndex]
      const img = new window.Image()
      img.onload = () => {
        setactiveIndex(imageIndex)
        setIsLoaded(true)
        getImgWidthHeight(img.width, img.height)
      }
      img.onerror = () => {
        propsvisible && onError && onError(imageIndex)
        setIsLoaded(true)
      }
      img.src = simpleData ? currentImage : currentImage.url
    },
    [images, activeIndex, isLoaded, propsvisible]
  )
  /**
   * 自动滚动函数，目前 API 未暴露
   */
  const addAutoPlayEvent = useCallback(() => {
    if (duration && duration > 0) {
      autoPlayTimer.current = setInterval(() => {
        loadImg(activeIndex + 1)
      }, duration)
    }
  }, [duration, loadImg])
  const imageMouseOut = useCallback(() => {
    clearInterval(autoPlayTimer.current)
    addAutoPlayEvent()
  }, [])
  const handleRotate = useCallback(
    (isRight) => {
      const { rotate } = style
      changeImageState({
        rotate: rotate + 90 * (isRight ? 1 : -1)
      })
    },
    [style, changeImageState]
  )
  const onClose = useCallback(
    (e) => {
      setStyle({})
      propsOnClose && propsOnClose()
    },
    [propsOnClose]
  )
  const clickEvent = useCallback(
    (type, event) => {
      event.stopPropagation()
      event.preventDefault()
      const { x, y } = getImageCenterXY()
      switch (type) {
        case 'zoomIn':
          handleZoom(x, y, 1)
          break
        case 'zoomOut':
          handleZoom(x, y, -1)
          break
        case 'reset':
          loadImg(activeIndex)
          break
        case 'leftRotate':
          handleRotate()
          break
        case 'rightRotate':
          handleRotate(true)
          break
        case 'prev':
          loadImg(activeIndex - 1)
          break
        case 'next':
          loadImg(activeIndex + 1)
          break
        case 'close':
          onClose()
          break
        default:
          break
      }
    },
    [activeIndex, getImageCenterXY, loadImg]
  )
  useEffect(() => {
    loadImg(activeIndex)
    addAutoPlayEvent()
    return () => {
      clearInterval(autoPlayTimer.current)
    }
  }, [])
  return createPortal(
    <ReactCSSTransitionGroup
      transitionName="hi-preview"
      transitionEnterTimeout={50}
      transitionLeaveTimeout={50}
      component="div"
    >
      <div
        ref={previewRef}
        className={classNames('hi-preview', className, { 'hi-preview--hide': !visible })}
        onMouseMove={handleMouseMove}
        onWheel={handleMouseWheel}
      >
        {isLoaded ? (
          <img
            ref={imgRef}
            src={simpleData ? images[activeIndex] : images[activeIndex].url}
            style={{ ...compileStyle }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseEnter={imageMouseOver}
            onMouseLeave={imageMouseOut}
            className="hi-preview__image"
          />
        ) : (
          <Loading size="small" />
        )}
        {showBar && (
          <div
            className="hi-preview-toolbar"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <Icon name="zoom-out" onClick={(e) => clickEvent('zoomOut', e)} />
            <Icon name="zoom-in" onClick={(e) => clickEvent('zoomIn', e)} />
            <Icon name="left" onClick={(e) => clickEvent('prev', e)} />
            <Icon name="ratio" onClick={(e) => clickEvent('reset', e)} />
            <Icon name="right" onClick={(e) => clickEvent('next', e)} />
            <Icon name="rotate-left" onClick={(e) => clickEvent('leftRotate', e)} />
            <Icon name="rotate-right" onClick={(e) => clickEvent('rightRotate', e)} />
          </div>
        )}
        <div className="hi-preview__close" onClick={onClose}>
          <Icon name="close-circle" style={{ fontSize: '36px', color: '#fff' }} />
        </div>
        {showArrow && (
          <div className="hi-preview__wrapper-arrow">
            <Icon name="left" onClick={(e) => clickEvent('prev', e)} />
            <Icon name="right" onClick={(e) => clickEvent('next', e)} />
          </div>
        )}
        {showCount && (
          <div className="hi-preview__count">
            <span>{activeIndex + 1}</span>
            &nbsp;/&nbsp;
            <span>{images.length}</span>
          </div>
        )}
      </div>
    </ReactCSSTransitionGroup>,
    node
  )
}
export default Preview
