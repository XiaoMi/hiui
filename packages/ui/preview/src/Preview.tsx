import React, { forwardRef, useCallback, useState, useEffect, useRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { Portal } from '@hi-ui/portal'
import { Watermark, WatermarkProps } from '@hi-ui/watermark'
import { CSSTransition } from 'react-transition-group'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseHTMLProps, usePortalContext } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import {
  ZoomInOutlined,
  ZoomOutOutlined,
  RotateLeftOutlined,
  RotateRightOutlined,
  LeftOutlined,
  RightOutlined,
  CloseOutlined,
} from '@hi-ui/icons'

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
      title,
      onError,
      onClose,
      src,
      watermarkProps,
      disabledDownload = false,
      container: containerProp,
      disabledPortal = false,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

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
        const newScale = Number(
          (imgTransform.scale + (type === 'zoomIn' ? 1 : -1) * 0.1).toFixed(1)
        )
        updateImgTransform({ ...imgTransform, scale: newScale })
      },
      [imgTransform]
    )

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

    return (
      <Portal container={container} disabled={disabledPortal}>
        <div ref={ref} role={role} className={cls} style={{ ...style, display: 'none' }}>
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
            <>
              <div className={`${prefixCls}__header`}>
                {title}
                <div className={`${prefixCls}__close-btn`} onClick={handleClose}>
                  <CloseOutlined />
                </div>
              </div>
              <div
                className={`${prefixCls}__container`}
                onClick={onClickContainer}
                tabIndex={-1}
                onWheel={handleWheel}
                ref={previewRef}
                onMouseMove={onMoving}
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
                    onMouseDown={onMoveStart}
                    onMouseUp={onMoveEnd}
                    onContextMenu={disabledDownload ? handleContextMenu : undefined}
                    src={Array.isArray(src) ? src[active] : src}
                    className={`${prefixCls}__image`}
                  />
                </div>
                <div className={`${prefixCls}__toolbar`}>
                  <ZoomInOutlined
                    onClick={() => {
                      handleZoom('zoomIn')
                    }}
                  />
                  <ZoomOutOutlined
                    onClick={() => {
                      if (imgTransform.scale >= 0.25) {
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

                {isMultiple && (
                  <>
                    <div
                      className={`${prefixCls}__left-btn`}
                      onClick={() => {
                        selectPrev()
                      }}
                    >
                      <LeftOutlined />
                    </div>
                    <div
                      className={`${prefixCls}__right-btn`}
                      onClick={() => {
                        selectNext()
                      }}
                    >
                      <RightOutlined />
                    </div>
                  </>
                )}
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
