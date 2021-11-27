import React, { cloneElement, isValidElement, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { PopperPortal as Popper } from '@hi-ui/popper'
import { useTooltip, UseTooltipProps } from './use-tooltip'

const _role = 'tooltip'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Tooltip
 */
export const Tooltip = forwardRef<HTMLDivElement | null, TooltipProps>(
  ({ prefixCls = _prefix, className, children, content, ...rest }, ref) => {
    const { rootProps, getTriggerProps, getPopperProps, getOverlayProps } = useTooltip(rest)

    const cls = cx(prefixCls, className)

    return (
      <>
        {/* TODO: 警告：子节点必须是合法的 React 元素 */}
        {isValidElement(children)
          ? cloneElement(
              children,
              // @ts-ignore
              getTriggerProps(children.props, children.ref)
            )
          : null}
        <Popper {...getPopperProps()} {...getOverlayProps()}>
          <div ref={ref} className={cls} {...rootProps}>
            <div className={`${prefixCls}__content`}>{content}</div>
          </div>
        </Popper>
      </>
    )
  }
)

export interface TooltipProps extends HiBaseHTMLProps<'div'>, UseTooltipProps {
  /**
   * 	提醒内容
   */
  content: React.ReactNode
}

if (__DEV__) {
  Tooltip.displayName = 'Tooltip'
}
