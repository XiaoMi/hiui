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
import { HiBaseHTMLProps, useGlobalContext } from '@hi-ui/core'
import { useTooltip, UseTooltipProps } from './use-tooltip'
import { CSSTransition } from 'react-transition-group'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { Portal } from '@hi-ui/portal'
import { isElement, isString } from '@hi-ui/type-assertion'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { TooltipHelpers } from './types'
import { ArrowIcon } from './ArrowIcon'

export const _prefix = getPrefixCls('tooltip')

/**
 * 文字提示
 */
export const Tooltip = forwardRef<HTMLDivElement | null, TooltipProps>(
  (
    {
      prefixCls = _prefix,
      className,
      style,
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
      classNames: classNamesProp,
      styles: stylesProp,
      ...rest
    },
    ref
  ) => {
    const ctx = useGlobalContext() as Record<string, { classNames?: any; styles?: any } | undefined>
    const tooltipConfig = ctx.tooltip
    const { classNames, styles } = useMergeSemantic<
      TooltipSemanticClassNames,
      TooltipSemanticStyles,
      TooltipProps
    >({
      classNamesList: [tooltipConfig?.classNames, classNamesProp],
      stylesList: [tooltipConfig?.styles, stylesProp],
      info: { props: { ...rest, title, arrow } },
    })
    const [transitionVisible, transitionVisibleAction] = useUncontrolledToggle({
      defaultVisible: false,
      visible: visibleProp,
      onOpen,
      onClose,
      isEqual: Object.is,
    })

    useEffect(() => {
      if (transitionVisible) {
        onOpen?.()
      }
    }, [onOpen, transitionVisible])

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

    const transitionNodeRef = React.useRef<HTMLElement>(null)

    if (triggerMemo === undefined) return null

    const cls = cx(prefixCls, className, classNames?.root)

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
            // 参考：https://github.com/reactjs/react-transition-group/issues/918
            nodeRef={transitionNodeRef}
          >
            <div
              className={cx(`${prefixCls}__popper`, classNames?.popper)}
              {...getPopperProps({}, [transitionNodeRef])}
              style={{ ...getPopperProps({}, [transitionNodeRef])?.style, ...styles?.popper }}
            >
              <div
                ref={ref}
                className={cls}
                style={{ ...style, ...styles?.root }}
                {...getTooltipProps()}
              >
                {arrow ? (
                  <div
                    className={cx(`${prefixCls}__arrow`, classNames?.arrow)}
                    {...getArrowProps()}
                    style={{ ...getArrowProps()?.style, ...styles?.arrow }}
                  >
                    <ArrowIcon />
                  </div>
                ) : null}
                <div
                  className={cx(`${prefixCls}__content`, classNames?.content)}
                  style={styles?.content}
                >
                  {title}
                </div>
              </div>
            </div>
          </CSSTransition>
        </Portal>
      </>
    )
  }
)

export type TooltipSemanticName = 'root' | 'popper' | 'arrow' | 'content'
export type TooltipSemanticClassNames = SemanticClassNamesType<TooltipProps, TooltipSemanticName>
export type TooltipSemanticStyles = SemanticStylesType<TooltipProps, TooltipSemanticName>
export type TooltipSemantic = ComponentSemantic<TooltipSemanticClassNames, TooltipSemanticStyles>
export interface TooltipProps extends HiBaseHTMLProps<'div'>, UseTooltipProps, TooltipSemantic {
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
   * 指定 portal 的容器
   */
  container?: HTMLElement
  /**
   * 禁用 portal
   */
  disabledPortal?: boolean
}

if (__DEV__) {
  Tooltip.displayName = 'Tooltip'
}
