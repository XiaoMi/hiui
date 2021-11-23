import React, { forwardRef, useCallback, useState, useEffect, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Portal } from '@hi-ui/portal'
import { CSSTransition } from 'react-transition-group'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  CloseCircleFilled,
  LeftOutlined,
  RightOutlined,
} from '@hi-ui/icons'

const PREVIEW_PREFIX = getPrefixCls('preview')

/**
 * TODO: What is Preview
 */

const defaultTransform = {
  scale: 1,
  translateX: 0,
  translateY: 0,
  rotate: 0,
}
export const Preview = forwardRef<HTMLDivElement | null, PreviewProps>(
  (
    {
      prefixCls = PREVIEW_PREFIX,
      role = 'preview',
      className,
      children,
      visible,
      current,
      onError,
      onClose,
      src,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const [isLoaded, setIsLoaded] = useState(false)
    const [isMoving, setIsMoving] = useState(false)
    const [imgTransfrom, updateImgTransform] = useState(defaultTransform)
    const movingPosition = useRef({
      pageX: 0,
      pageY: 0,
      originX: 0,
      originY: 0,
    })

    const imgRef = useRef<HTMLImageElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)

    // 重置图片
    const resetTransform = useCallback(() => {
      updateImgTransform(defaultTransform)
    }, [])

    useEffect(() => {
      // 每次打开预览，重置图片样式
      if (visible) {
        resetTransform()
      }
    }, [visible, resetTransform])

    // 点击容器区域
    const onClickContainer = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          if (onClose) {
            onClose(e)
          }
        }
      },
      [onClose]
    )

    // 缩放处理
    const handleZoom = useCallback(
      (type: 'zoomIn' | 'zoomOut') => {
        const newScale = Number(
          (imgTransfrom.scale + (type === 'zoomIn' ? 1 : -1) * 0.1).toFixed(1)
        )
        updateImgTransform({ ...imgTransfrom, scale: newScale })
      },
      [imgTransfrom]
    )

    // 翻转处理
    const handleRotate = useCallback(
      (direction: 'left' | 'right') => {
        const newRotate = imgTransfrom.rotate + (direction === 'right' ? 1 : -1) * 90
        updateImgTransform({ ...imgTransfrom, rotate: newRotate })
      },
      [imgTransfrom]
    )

    // 滚轮处理
    const handleWheel = useCallback(
      (e: React.WheelEvent) => {
        let type: 'zoomIn' | 'zoomOut' = 'zoomIn'
        if (e.deltaY > 0) {
          type = 'zoomOut'
        }
        handleZoom(type)
      },
      [handleZoom]
    )

    // 移动中
    const onMoving = useCallback(
      (e: React.MouseEvent) => {
        if (isMoving) {
          e.preventDefault()
          const { originX, originY, pageX, pageY } = movingPosition.current
          const nextX = originX + (e.pageX - pageX) / imgTransfrom.scale
          const nextY = originY + (e.pageY - pageY) / imgTransfrom.scale
          updateImgTransform({
            ...imgTransfrom,
            translateX: nextX,
            translateY: nextY,
          })
        }
      },
      [imgTransfrom, isMoving]
    )
    // 移动后
    const onMoveEnd = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      setIsMoving(false)
    }, [])

    // 移动前
    const onMoveStart = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault()
        setIsMoving(true)
        movingPosition.current.pageX = e.pageX
        movingPosition.current.pageY = e.pageY
        movingPosition.current.originX = imgTransfrom.translateX
        movingPosition.current.originY = imgTransfrom.translateY
      },
      [imgTransfrom]
    )

    return (
      <Portal>
        <div ref={ref} role={role} className={cls} style={{ display: 'none' }}>
          <CSSTransition
            classNames={`${prefixCls}__mask--transition`}
            in={visible}
            timeout={300}
            mountOnEnter
            unmountOnExit={false}
            onEnter={(ele: HTMLElement) => {
              ;(ele.parentNode as HTMLElement).style.display = 'block'
              ele.style.display = 'block'
            }}
            onExited={(ele: HTMLElement) => {
              ;(ele.parentNode as HTMLElement).style.display = 'none'
              ele.style.display = 'none'
            }}
          >
            <div className={`${prefixCls}__mask`} />
          </CSSTransition>
          {visible && (
            <div
              className={`${prefixCls}__container`}
              onClick={onClickContainer}
              tabIndex={-1}
              onWheel={handleWheel}
              ref={previewRef}
              onMouseMove={onMoving}
            >
              <img
                ref={imgRef}
                onLoad={() => {
                  setIsLoaded(true)
                }}
                onMouseDown={onMoveStart}
                onMouseUp={onMoveEnd}
                src="http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png"
                className={`${prefixCls}__image`}
                style={{
                  transform: `scale(${imgTransfrom.scale}, ${imgTransfrom.scale}) translate(${imgTransfrom.translateX}px,${imgTransfrom.translateY}px) rotate(${imgTransfrom.rotate}deg)`,
                }}
              />
              <div className={`${prefixCls}__toolbar`}>
                <ZoomInOutlined
                  onClick={() => {
                    handleZoom('zoomIn')
                  }}
                />
                <ZoomOutOutlined
                  onClick={() => {
                    if (imgTransfrom.scale >= 0.25) {
                      handleZoom('zoomOut')
                    }
                  }}
                />
                <RotateLeftOutlined
                  onClick={() => {
                    handleRotate('left')
                  }}
                />
                <RotateRightOutlined
                  onClick={() => {
                    handleRotate('right')
                  }}
                />
              </div>
              <div className={`${prefixCls}__close-btn`} onClick={onClose}>
                <CloseCircleFilled />
              </div>
              <div className={`${prefixCls}__left-btn`} onClick={onClose}>
                <LeftOutlined />
              </div>
              <div className={`${prefixCls}__right-btn`} onClick={onClose}>
                <RightOutlined />
              </div>
            </div>
          )}
        </div>
      </Portal>
    )
  }
)

export interface PreviewProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 是否显示预览窗体
   */
  visible?: boolean
  /**
   * 预览图片地址
   */
  src?: string | string[]

  /**
   * 当前预览图片索引
   */
  current?: number

  /**
   * 加载错误回调
   */
  onError?: (event: Event) => void
  /**
   * 关闭预览的回调
   */
  onClose?: (event: React.MouseEvent) => void
}

if (__DEV__) {
  Preview.displayName = 'Preview'
}
