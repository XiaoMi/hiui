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
import { isString } from '@hi-ui/type-assertion'

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
      preload = false,
      unmountOnClose = true,
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

    const { getTriggerProps, getPopperProps, getTooltipProps, getArrowProps } = useTooltip({
      ...rest,
      visible: !transitionExisted,
      onOpen: transitionVisibleAction.on,
      onClose: transitionVisibleAction.off,
    })

    const cls = cx(prefixCls, className)

    let trigger: React.ReactElement

    if (isValidElement(children)) {
      trigger = children
    } else {
      if (isString(children)) {
        trigger = <span tabIndex={0}>{children}</span>
      } else {
        // TODO: invariant(true, 'The children should be an React.Element.')
        if (__DEV__) {
          console.warn('WARNING (Tooltip): The children should be an React.Element.')
        }
        return null
      }
    }

    return (
      <>
        {cloneElement(
          trigger,
          // @ts-ignore
          getTriggerProps(trigger.props, trigger.ref)
        )}

        <Portal {...portal}>
          <CSSTransition
            classNames={`${prefixCls}--motion`}
            appear
            timeout={201}
            in={transitionVisible}
            mountOnEnter={!preload}
            unmountOnExit={unmountOnClose}
            onExited={onExited}
          >
            <div className={`${prefixCls}__popper`} {...getPopperProps()}>
              <div ref={ref} className={cls} {...getTooltipProps()}>
                {arrow ? <div className={`${prefixCls}__arrow`} {...getArrowProps()} /> : null}
                <div className={`${prefixCls}__content`}>{content}</div>
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
  /**
   * 开启预加载渲染，用于性能优化，优先级小于 `unmountOnClose`
   */
  preload?: boolean
  /**
   * 开启关闭时销毁，用于性能优化，优先级大于 `preload`
   */
  unmountOnClose?: boolean
}

if (__DEV__) {
  Tooltip.displayName = 'Tooltip'
}
