import React, { forwardRef, useCallback, useEffect, useState } from 'react'
import { cx, getPrefixCls, getPrefixStyleVar } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, useGlobalContext, usePortalContext } from '@hi-ui/core'
import { CSSTransition } from 'react-transition-group'
import { Portal } from '@hi-ui/portal'
import { useModal, UseModalProps } from '@hi-ui/modal'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useToggle } from '@hi-ui/use-toggle'
import { isNumeric } from '@hi-ui/type-assertion'
import { CloseOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'
import { mergeRefs } from '@hi-ui/react-utils'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { DrawerPlacementEnum } from './types'

const DRAWER_PREFIX = getPrefixCls('drawer')

const defaultCloseIcon = <CloseOutlined />

/**
 * 抽屉
 */
export const Drawer = forwardRef<HTMLDivElement | null, DrawerProps>(
  (
    {
      prefixCls = DRAWER_PREFIX,
      className,
      styles,
      children,
      disabledPortal = false,
      closeable = true,
      timeout = 300,
      onExited: onExitedProp,
      title,
      footer,
      container: containerProp,
      closeIcon = defaultCloseIcon,
      width,
      height,
      size: sizeProp,
      preload = false,
      unmountOnClose = false,
      visible = false,
      onClose,
      showMask = true,
      placement = 'right',
      drawerConfig,
      onOutsideClick,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useToggle(false)
    const [transitionExited, transitionExitedAction] = useToggle(true)
    const globalContainer = usePortalContext()?.container
    const container = containerProp ?? globalContainer
    const { size: globalSize } = useGlobalContext()
    let size = sizeProp ?? globalSize ?? 'md'
    if (size === 'xs') {
      size = 'sm'
    }
    if (size === 'lg') {
      size = 'md'
    }

    const { rootProps, getModalProps, getModalWrapperProps } = useModal({
      ...rest,
      visible: !transitionExited,
      onClose,
      container,
    })

    useEffect(() => {
      transitionVisibleAction.set(visible)

      if (visible) {
        transitionExitedAction.off()
      }

      return () => {
        if (!visible) {
          transitionVisibleAction.off()
        }
      }
    }, [visible, transitionVisibleAction, transitionExitedAction])

    const modalProps = getModalProps(rootProps, ref)
    const innerRef = React.useRef<HTMLDivElement | null>(null)

    useOutsideClick(innerRef, onOutsideClick)

    const onExitedLatest = useLatestCallback(onExitedProp)
    const onExited = useCallback(() => {
      transitionExitedAction.on()
      onExitedLatest()
    }, [onExitedLatest, transitionExitedAction])

    const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null)
    const [scrollState, setScrollState] = useState<{
      isContentOverflow: boolean
      isScrollToTop: boolean
      isScrollToBottom: boolean
    }>({
      isContentOverflow: false,
      isScrollToTop: true,
      isScrollToBottom: false,
    })

    const handleScroll = useCallback((evt: React.UIEvent<HTMLDivElement>) => {
      if (!evt.currentTarget) return

      const { scrollTop, scrollHeight, clientHeight } = evt.currentTarget

      // 判断内容是否超过容器高度
      const isContentOverflow = scrollHeight > clientHeight

      // 判断是否滚动到顶部
      const isScrollToTop = scrollTop === 0

      // 判断是否滚动到底部
      const isScrollToBottom = scrollTop + clientHeight >= scrollHeight - 1 // 减1像素容差

      setScrollState({
        isContentOverflow,
        isScrollToTop,
        isScrollToBottom,
      })
    }, [])

    useEffect(() => {
      if (scrollElement && visible) {
        handleScroll({ currentTarget: scrollElement } as React.UIEvent<HTMLDivElement>)
      }
    }, [handleScroll, visible, scrollElement])

    const hasHeader = !!title || closeable
    const bodyWidth = isNumeric(width) ? width + 'px' : width
    const bodyHeight = isNumeric(height) ? height + 'px' : height

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--placement-${placement}`,
      `${prefixCls}--size-${size}`
    )

    return (
      <Portal container={container} disabled={disabledPortal}>
        <CSSTransition
          classNames={`${prefixCls}--motion`}
          in={transitionVisible}
          timeout={timeout}
          appear
          onExited={onExited}
          mountOnEnter={!preload}
          unmountOnExit={unmountOnClose}
          // 参考：https://github.com/reactjs/react-transition-group/issues/918
          nodeRef={innerRef}
        >
          <div
            className={cls}
            {...{
              ...modalProps,
              ref: mergeRefs(modalProps.ref, innerRef),
            }}
            {...(!showMask &&
              visible && {
                style:
                  placement === 'left' || placement === 'right'
                    ? {
                        ...modalProps.style,
                        [`${getPrefixStyleVar('drawer-body-width')}`]: bodyWidth ?? '404px',
                      }
                    : {
                        ...modalProps.style,
                        [`${getPrefixStyleVar('drawer-body-height')}`]: bodyHeight ?? '404px',
                      },
              })}
          >
            {showMask ? <div className={`${prefixCls}__overlay`} /> : null}
            <div
              className={`${prefixCls}__wrapper`}
              style={{
                [`${getPrefixStyleVar('drawer-body-width')}`]: bodyWidth,
                [`${getPrefixStyleVar('drawer-body-height')}`]: bodyHeight,
              }}
              {...getModalWrapperProps(drawerConfig)}
            >
              {hasHeader ? (
                <header className={`${prefixCls}__header`} style={styles?.header}>
                  {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
                  {closeable ? <IconButton effect onClick={onClose} icon={closeIcon} /> : null}
                </header>
              ) : null}
              <main
                className={`${prefixCls}__body`}
                style={styles?.body}
                ref={setScrollElement}
                onScroll={handleScroll}
              >
                {children}
              </main>
              {footer ? (
                <footer
                  className={cx(
                    `${prefixCls}__footer`,
                    scrollState.isContentOverflow &&
                      !scrollState.isScrollToBottom &&
                      `${prefixCls}__footer--divided`
                  )}
                  style={styles?.footer}
                >
                  {footer}
                </footer>
              ) : null}
            </div>
          </div>
        </CSSTransition>
      </Portal>
    )
  }
)

export interface DrawerProps extends Omit<HiBaseHTMLProps<'div'>, 'title'>, UseModalProps {
  /**
   * 模态框标题
   */
  title?: React.ReactNode
  /**
   * 自定义抽屉底部
   */
  footer?: React.ReactNode
  /**
   * 自定义抽屉样式
   */
  styles?: {
    header?: React.CSSProperties
    body?: React.CSSProperties
    footer?: React.CSSProperties
  }
  /**
   * 是否显示蒙层
   */
  showMask?: boolean
  /**
   * 自定义抽屉宽度，仅在 placement="left" | "right" 有效
   */
  width?: number | string
  /**
   * 自定义抽屉高度，仅在 placement="bottom" | "top" 有效
   */
  height?: number | string
  /**
   * 头部大小
   */
  size?: 'sm' | 'md'
  /**
   * 自定义css展示层级
   */
  zIndex?: number
  /**
   * 开启预加载渲染，用于性能优化，优先级小于 `unmountOnClose`
   */
  preload?: boolean
  /**
   * 开启关闭时销毁，用于性能优化，优先级大于 `preload`
   */
  unmountOnClose?: boolean
  /**
   * 关闭事件触发时的回调
   */
  onClose?: () => void
  /**
   * 指定 portal 的容器
   */
  container?: HTMLElement | null
  /**
   * 设置唤起的方向
   */
  placement?: DrawerPlacementEnum
  /**
   * 是否展示右上角关闭按钮
   */
  closeable?: boolean
  /**
   * 外界元素点击数触发
   */
  onOutsideClick?: (evt: Event) => void
  /**
   * 自定义关闭按钮
   */
  closeIcon?: React.ReactNode
  /**
   * 自定义动画过渡时长。暂不对外暴露
   * @private
   */
  timeout?: number
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
  /**
   * 关闭动画退出时回调。暂不对外暴露
   * @private
   */
  onExited?: () => void
  /**
   * drawer 实体的 props。暂不对外暴露
   * @private
   */
  drawerConfig?: HiBaseHTMLProps<'div'>
}

if (__DEV__) {
  Drawer.displayName = 'Drawer'
}
