import React, {
  cloneElement,
  isValidElement,
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__, invariant } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useTooltip, UseTooltipProps } from './use-tooltip'
import { CSSTransition } from 'react-transition-group'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { Portal } from '@hi-ui/portal'
import { isElement, isString } from '@hi-ui/type-assertion'
import { useLatestCallback } from '@hi-ui/use-latest'
import { TooltipHelpers } from './types'

export const _prefix = getPrefixCls('tooltip')

/**
 * TODO: What is Tooltip
 */
export const Tooltip = forwardRef<HTMLDivElement | null, TooltipProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      title,
      arrow = true,
      visible: visibleProp,
      container,
      disabledPortal = false,
      onOpen,
      onClose,
      preload = false,
      // 默认行为一直销毁
      unmountOnClose = true,
      onExited,
      innerRef,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useUncontrolledToggle({
      defaultVisible: false,
      visible: visibleProp,
      onOpen,
      onClose,
      isEqual: Object.is,
    })

    // TODO: 1. 优化封装完全非受控 2. useTooltip 支持 attachEl 设置
    // 用于 api 式完全非受控隐藏
    const [internalVisible, setInternalVisible] = useState<boolean | undefined>(undefined)

    useImperativeHandle(innerRef, () => ({
      close: () => setInternalVisible(false),
      update: updatePopper,
    }))

    const [transitionExisted, setTransitionExisted] = useState(!transitionVisible)

    // 由 CSSTransition 设置动效结束
    const onExitedLatest = useLatestCallback(() => {
      setTransitionExisted(true)
      onExited?.()
    })

    useEffect(() => {
      // transitionVisibleAction.set(transitionVisible)
      if (transitionVisible) {
        setTransitionExisted(false)
      }
    }, [transitionVisible, transitionVisibleAction])

    const {
      setTriggerElement,
      getTriggerProps,
      getPopperProps,
      getTooltipProps,
      getArrowProps,
      updatePopper,
    } = useTooltip({
      ...rest,
      visible: !transitionExisted,
      onOpen: transitionVisibleAction.on,
      onClose: transitionVisibleAction.off,
    })

    const triggerMemo = useMemo(() => {
      let trigger: React.ReactElement | null | undefined

      if (isElement(children)) {
        trigger = null
        setTriggerElement(children as HTMLElement)
      } else if (isValidElement(children)) {
        trigger = cloneElement(
          children,
          // @ts-ignore
          getTriggerProps(children.props, children.ref)
        )
      } else {
        if (isString(children)) {
          trigger = (
            <span tabIndex={0} {...getTriggerProps()}>
              {children}
            </span>
          )
        } else {
          if (__DEV__) {
            invariant(false, 'The children should be an React.Element.')
          }
        }
      }
      return trigger
    }, [children, getTriggerProps, setTriggerElement])

    if (triggerMemo === undefined) return null

    const cls = cx(prefixCls, className)

    return (
      <>
        {triggerMemo}
        <Portal container={container} disabled={disabledPortal}>
          <CSSTransition
            classNames={`${prefixCls}--motion`}
            appear
            timeout={201}
            in={internalVisible ?? transitionVisible}
            mountOnEnter={!preload}
            unmountOnExit={unmountOnClose}
            onExited={onExitedLatest}
          >
            <div className={`${prefixCls}__popper`} {...getPopperProps()}>
              <div ref={ref} className={cls} {...getTooltipProps()}>
                {arrow ? <div className={`${prefixCls}__arrow`} {...getArrowProps()} /> : null}
                <div className={`${prefixCls}__content`}>{title}</div>
              </div>
            </div>
          </CSSTransition>
        </Portal>
      </>
    )
  }
)

export interface TooltipProps extends HiBaseHTMLProps<'div'>, UseTooltipProps {
  /**
   * 	提醒内容
   * TODO: 使用 content 统一字段
   */
  title: React.ReactNode
  /**
   * 是否显示箭头
   */
  arrow?: boolean
  /**
   * 开启预加载渲染，用于性能优化，优先级小于 `unmountOnClose`。暂不对外暴露
   * @private
   */
  preload?: boolean
  /**
   * 开启关闭时销毁，用于性能优化，优先级大于 `preload`。暂不对外暴露
   * @private
   */
  unmountOnClose?: boolean
  /**
   * 关闭动画退出时回调。暂不对外暴露
   * @private
   */
  onExited?: () => void
  /**
   *。暂不对外暴露
   * @private
   */
  innerRef?: React.Ref<TooltipHelpers>
  /**
   * 指定 portal 的容器。暂不对外暴露
   * @private
   */
  container?: HTMLElement
  /**
   * 禁用 portal。暂不对外暴露
   * @private
   */
  disabledPortal?: boolean
}

if (__DEV__) {
  Tooltip.displayName = 'Tooltip'
}
