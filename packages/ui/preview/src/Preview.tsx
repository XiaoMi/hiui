import React, { forwardRef, useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Portal } from '@hi-ui/portal'
import { Watermark, WatermarkProps } from '@hi-ui/watermark'
import { CSSTransition } from 'react-transition-group'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseHTMLProps, usePortalContext } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useScrollLock } from '@hi-ui/use-scroll-lock'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  LeftOutlined,
  RightOutlined,
  DownloadOutlined,
} from '@hi-ui/icons'
import { Scale1Icon } from './scale1Icon'

const PREVIEW_PREFIX = getPrefixCls('preview')

/**
 * 图片预览
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
      style,
      visible = false,
      current,
      defaultCurrent,
      onPreviewChange,
      title: titleProp,
      onError,
      onClose,
      onDownload,
      src,
      watermarkProps,
      disabledDownload = false,
      container: containerProp,
      disabledPortal = false,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)
    const maskElRef = useRef<HTMLDivElement>(null)

    const globalContainer = usePortalContext()?.container
    const container = containerProp ?? globalContainer

    const [active, setActive] = useUncontrolledState(defaultCurrent || 0, current, onPreviewChange)

    const [isMoving, setIsMoving] = useState(false)
    const [imgTransform, updateImgTransform] = useState(defaultTransform)
    const movingPosition = useRef({
      pageX: 0,
      pageY: 0,
      originX: 0,
      originY: 0,
    })

    const imgRef = useRef<HTMLImageElement>(null)
    const previewRef = useRef<HTMLDivElement>(null)

    const isMultiple = useMemo(() => Array.isArray(src) && src.length > 1, [src])

    const title = useMemo(() => {
      return titleProp ?? getTitle(Array.isArray(src) ? src[active] : src)
    }, [active, src, titleProp])

    // 锁定外部滚动
    useScrollLock(previewRef, { enabled: visible })

    // 图片加水印
    const [watermarkContainer, setWatermarkContainer] = useState<HTMLDivElement | null>(null)

    const handleContextMenu = useLatestCallback((evt: React.MouseEvent) => {
      evt.preventDefault()
    })

    // 重置图片
    const resetTransform = useCallback(() => {
      updateImgTransform(defaultTransform)
    }, [])

    useEffect(() => {
      // 每次打开预览，重置图片样式
      if (visible) {
        resetTransform()
        previewRef.current?.focus()
      }
    }, [visible, resetTransform, active])

    const handleClose = useLatestCallback((evt: React.MouseEvent | React.KeyboardEvent) => {
      evt.stopPropagation()
      onClose?.()
    })

    // 点击容器区域
    const onClickContainer = useCallback(
      (evt: React.MouseEvent) => {
        if (evt.target === evt.currentTarget) {
          handleClose(evt)
        }
      },
      [handleClose]
    )

    // 缩放处理
    const handleZoom = useCallback(
      (type: 'zoomIn' | 'zoomOut') => {
        const currentScale = imgTransform.scale
        // 动态步长：根据当前缩放比例调整步长
        let step = 0.1
        if (currentScale < 0.5) {
          step = 0.05 // 小比例时使用更小的步长
        } else if (currentScale < 1) {
          step = 0.1
        } else if (currentScale < 2) {
          step = 0.2
        } else if (currentScale < 5) {
          step = 0.5
        } else {
          step = 1 // 大比例时使用更大的步长
        }

        const delta = (type === 'zoomIn' ? 1 : -1) * step
        const newScale = Number((currentScale + delta).toFixed(2))

        // 边界值检查：最小 0.1，最大 10
        if (newScale < 0.05) {
          return
        }
        if (newScale > 10) {
          updateImgTransform({ ...imgTransform, scale: 10 })
          return
        }

        updateImgTransform({ ...imgTransform, scale: newScale })
      },
      [imgTransform]
    )

    const handleZoomTo1 = useCallback(() => {
      updateImgTransform({ ...imgTransform, scale: 1 })
    }, [imgTransform])

    // 翻转处理
    const handleRotate = useCallback(
      (direction: 'left' | 'right') => {
        const newRotate = imgTransform.rotate + (direction === 'right' ? 1 : -1) * 90
        updateImgTransform({ ...imgTransform, rotate: newRotate })
      },
      [imgTransform]
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
          const nextX = originX + (e.pageX - pageX) / imgTransform.scale
          const nextY = originY + (e.pageY - pageY) / imgTransform.scale
          updateImgTransform({
            ...imgTransform,
            translateX: nextX,
            translateY: nextY,
          })
        }
      },
      [imgTransform, isMoving]
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
        movingPosition.current.originX = imgTransform.translateX
        movingPosition.current.originY = imgTransform.translateY
      },
      [imgTransform]
    )

    const selectPrev = useCallback(() => {
      setActive(active - 1 < 0 ? src.length - 1 : active - 1)
    }, [active, setActive, src])

    const selectNext = useCallback(() => {
      setActive(active + 1 >= src.length ? 0 : active + 1)
    }, [active, setActive, src])

    // 键盘事件
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (isMultiple) {
          if (e.key === 'ArrowLeft') {
            selectPrev()
          } else if (e.key === 'ArrowRight') {
            selectNext()
          }
        }

        if (e.key === 'Escape') {
          handleClose(e)
        }

        e.stopPropagation()
      },
      [handleClose, isMultiple, selectNext, selectPrev]
    )

    const handleDownload = useCallback(() => {
      typeof onDownload === 'function'
        ? onDownload(Array.isArray(src) ? src[active] : src)
        : downloadImage(Array.isArray(src) ? src[active] : src)
    }, [active, onDownload, src])

    const handleClick = useCallback(
      (evt: React.MouseEvent) => {
        evt.stopPropagation()
        evt.preventDefault()

        if (imgTransform.scale >= 0.25) {
          handleZoom('zoomOut')
        } else {
          handleClose(evt)
        }
      },
      [handleClose, handleZoom, imgTransform.scale]
    )

    return (
      <Portal container={container} disabled={disabledPortal}>
        <div ref={ref} role={role} className={cls} style={{ ...style, display: 'none' }}>
          <CSSTransition
            appear
            classNames={`${prefixCls}__mask--transition`}
            in={visible}
            timeout={200}
            mountOnEnter
            unmountOnExit={false}
            // 参考：https://github.com/reactjs/react-transition-group/issues/918
            nodeRef={maskElRef}
            onEnter={() => {
              const ele = maskElRef.current
              if (!ele) return
              ;(ele.parentNode as HTMLElement).style.display = 'block'
              ele.style.display = 'block'
            }}
            onExited={() => {
              const ele = maskElRef.current
              if (!ele) return
              ;(ele.parentNode as HTMLElement).style.display = 'none'
              ele.style.display = 'none'
            }}
          >
            <div className={`${prefixCls}__mask`} ref={maskElRef} />
          </CSSTransition>
          {visible && (
            <>
              <div className={`${prefixCls}__header`}>
                <div className={`${prefixCls}__title`}>{title}</div>
                <i className={`${prefixCls}__close-btn`} onClick={handleClose} />
              </div>
              <div
                className={`${prefixCls}__container`}
                onClick={onClickContainer}
                tabIndex={-1}
                onWheel={handleWheel}
                ref={previewRef}
                // onMouseMove={onMoving}
                onKeyDown={handleKeyDown}
              >
                <div
                  className={`${prefixCls}__img-wrapper`}
                  ref={(e) => {
                    setWatermarkContainer(e)
                  }}
                  style={{
                    transform: `scale(${imgTransform.scale}, ${imgTransform.scale}) translate(${imgTransform.translateX}px,${imgTransform.translateY}px) rotate(${imgTransform.rotate}deg)`,
                  }}
                >
                  <img
                    ref={imgRef}
                    onError={onError}
                    // onMouseDown={onMoveStart}
                    // onMouseUp={onMoveEnd}
                    onClick={handleClick}
                    onContextMenu={disabledDownload ? handleContextMenu : undefined}
                    src={Array.isArray(src) ? src[active] : src}
                    className={`${prefixCls}__image`}
                  />
                </div>
                <div className={`${prefixCls}__toolbar`}>
                  {isMultiple && (
                    <>
                      <div className={`${prefixCls}__toolbar-action`} onClick={selectPrev}>
                        <LeftOutlined />
                      </div>
                      <span className={`${prefixCls}__toolbar-index`}>
                        {active + 1}/{src.length}
                      </span>
                      <div className={`${prefixCls}__toolbar-action`} onClick={selectNext}>
                        <RightOutlined />
                      </div>
                      <i className={`${prefixCls}__toolbar-divider`} />
                    </>
                  )}
                  <div
                    className={`${prefixCls}__toolbar-action`}
                    onClick={() => {
                      if (imgTransform.scale >= 0.25) {
                        handleZoom('zoomOut')
                      }
                    }}
                  >
                    <ZoomOutOutlined />
                  </div>
                  <span className={`${prefixCls}__toolbar-scale`}>
                    {(imgTransform.scale * 100).toFixed(0)}%
                  </span>
                  <div
                    className={`${prefixCls}__toolbar-action`}
                    onClick={() => handleZoom('zoomIn')}
                  >
                    <ZoomInOutlined />
                  </div>
                  <div className={`${prefixCls}__toolbar-action`} onClick={handleZoomTo1}>
                    <Scale1Icon />
                  </div>
                  <i className={`${prefixCls}__toolbar-divider`} />
                  <div
                    className={`${prefixCls}__toolbar-action`}
                    onClick={() => handleRotate('right')}
                  >
                    <RotateRightOutlined />
                  </div>
                  <div
                    className={`${prefixCls}__toolbar-action`}
                    onClick={() => handleRotate('left')}
                  >
                    <RotateLeftOutlined />
                  </div>
                  <i className={`${prefixCls}__toolbar-divider`} />
                  <div className={`${prefixCls}__toolbar-action`} onClick={handleDownload}>
                    <DownloadOutlined />
                  </div>
                </div>
              </div>
              {watermarkProps && watermarkContainer && (
                <Watermark {...watermarkProps} container={watermarkContainer} />
              )}
            </>
          )}
        </div>
      </Portal>
    )
  }
)

export interface PreviewProps extends Omit<HiBaseHTMLProps<'div'>, 'onError'> {
  /**
   * 是否显示预览窗体
   */
  visible: boolean
  /**
   * 预览窗体标题
   */
  title?: string
  /**
   * 预览图片地址
   */
  src: string | string[]
  /**
   * 当前预览图片索引(受控)
   */
  current?: number
  /**
   * 当前预览图片索引
   */
  defaultCurrent?: number
  /**
   * 设置图片水印
   */
  watermarkProps?: Omit<WatermarkProps, 'container'>
  /**
   * 是否禁止右键下载图片
   */
  disabledDownload?: boolean
  /**
   * 加载错误回调
   */
  onError?: React.ReactEventHandler<HTMLImageElement>
  /**
   * 关闭预览的回调
   */
  onClose?: () => void
  /**
   * 当前预览图片索引(受控)
   */
  onPreviewChange?: (current: number) => void
  /**
   * 下载图片的回调
   */
  onDownload?: (url: string) => void
  /**
   * 指定 portal 的容器
   */
  container?: HTMLElement | null
  /**
   * 是否禁用 portal
   */
  disabledPortal?: boolean
}

if (__DEV__) {
  Preview.displayName = 'Preview'
}

const getTitle = (url: string = '') => {
  return url.split('/').pop()?.split('?')[0] || ''
}

export const downloadImage = (url: string) => {
  const filename = Date.now() + (getTitle(url) || 'image.png')

  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(blobUrl)
      link.remove()
    })
    .catch((err) => {
      console.error(err)
      // 如果下载失败，则打开图片
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      a.remove()
    })
}
