import React, {
  cloneElement,
  isValidElement,
  forwardRef,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useTooltip, UseTooltipProps } from './use-tooltip'
import { CSSTransition } from 'react-transition-group'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import Portal, { PortalProps } from '@hi-ui/portal'

const _role = 'tooltip'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Tooltip
 */
export const Tooltip = forwardRef<HTMLDivElement | null, TooltipProps>(
  (
    {
      prefixCls = _prefix,
      className,
      children,
      content,
      arrow = true,
      visible: visibleProp,
      portal,
      onOpen,
      onClose,
      ...rest
    },
    ref
  ) => {
    const [transitionVisible, transitionVisibleAction] = useUncontrolledToggle({
      defaultVisible: false,
      visible: visibleProp,
      onOpen,
      onClose,
    })

    const [transitionExisted, setTransitionExisted] = useState(!transitionVisible)
    // 由 CSSTransition 设置动效结束
    const onExited = useCallback(() => setTransitionExisted(true), [])

    useEffect(() => {
      transitionVisibleAction.set(transitionVisible)
      if (transitionVisible) {
        setTransitionExisted(false)
      }
    }, [transitionVisible, transitionVisibleAction])

    const {
      // shouldRenderPopper,
      getTriggerProps,
      getPopperProps,
      getTooltipProps,
      getArrowProps,
    } = useTooltip({
      ...rest,
      visible: !transitionExisted,
      onOpen: transitionVisibleAction.on,
      onClose: transitionVisibleAction.off,
    })

    const cls = cx(prefixCls, className)

    if (!isValidElement(children)) {
      if (__DEV__) {
        console.warn('WARNING (Tooltip): The children should be an React.Element.')
      }
      return null
    }

    return (
      <>
        {cloneElement(
          children,
          // @ts-ignore
          getTriggerProps(children.props, children.ref)
        )}
        <Portal {...portal}>
          {/* 如何在 close 时销毁 DOM，避免无用 dom 堆积 */}
          <div className={`${prefixCls}__popper`} {...getPopperProps()}>
            <CSSTransition
              classNames={`${prefixCls}--motion`}
              timeout={201}
              in={transitionVisible}
              onExited={onExited}
            >
              <div ref={ref} className={cls} {...getTooltipProps()}>
                {arrow ? <div className={`${prefixCls}__arrow`} {...getArrowProps()} /> : null}
                <div className={`${prefixCls}__content`}>{content}</div>
              </div>
            </CSSTransition>
          </div>
        </Portal>
      </>
    )
  }
)

export interface TooltipProps extends HiBaseHTMLProps<'div'>, UseTooltipProps {
  /**
   * 	提醒内容
   */
  content: React.ReactNode
  /**
   * 是否显示箭头
   */
  arrow?: boolean
  /**
   * 传送门 props
   */
  portal?: PortalProps
}

if (__DEV__) {
  Tooltip.displayName = 'Tooltip'
}
