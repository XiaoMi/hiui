import React, { cloneElement, forwardRef, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import Popper from '@hi-ui/popper'
import { TriggerActionEnum } from './types'
import { normalizeTrigger } from './utils'
import { useToggle } from '@hi-ui/use-toggle'

const _role = 'popover'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Popover
 */
export const Popover = forwardRef<HTMLDivElement | null, PopoverProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      visible: visibleProp,
      placement = 'top',
      zIndex = 1100,
      trigger = 'click',
      popper,
      title,
      content,
      ...rest
    },
    ref
  ) => {
    const [popperEl, setPopperEl] = React.useState<HTMLElement | null>(null)

    const [popperVisible, popperVisibleAction] = useToggle()
    const visible = visibleProp ?? popperVisible

    const triggerMethods = React.useMemo(() => normalizeTrigger(trigger), [trigger])

    const handleMouseLeave = React.useCallback(
      (evt: MouseEvent) => {
        console.log(evt)
        if (popperEl?.contains(evt.target as HTMLElement)) return
        popperVisibleAction.off()
      },
      [popperVisibleAction, popperEl]
    )

    // 事件收集
    // 'click' | 'contextmenu' | 'hover'
    const eventHandler = React.useMemo(() => {
      return triggerMethods.reduce((acc, cur) => {
        switch (cur) {
          // TODO: 处理冒泡，模拟冒泡阻止事件触发
          case TriggerActionEnum.HOVER:
            acc.onMouseEnter = popperVisibleAction.on
            acc.onMouseLeave = handleMouseLeave
            break
          case TriggerActionEnum.CONTEXTMENU:
            acc.onContextMenu = popperVisibleAction.not
            break
          case TriggerActionEnum.CLICK:
            acc.onClick = popperVisibleAction.not
            break
        }

        return acc
      }, {} as any)
    }, [triggerMethods, popperVisibleAction, handleMouseLeave])

    const cls = cx(prefixCls, className)

    return (
      <div ref={setPopperEl} role={role} className={cls} {...rest}>
        <div>{React.isValidElement(children) ? cloneElement(children, {}) : null}</div>
        <Popper visible={visible} attachEl={popperEl} placement={placement} zIndex={zIndex}>
          <div className={`${prefixCls}__body`}>
            {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
            <div className={`${prefixCls}__content`}>{content}</div>
          </div>
        </Popper>
      </div>
    )
  }
)

export interface PopoverProps extends HiBaseHTMLProps<'div'> {}

if (__DEV__) {
  Popover.displayName = 'Popover'
}
