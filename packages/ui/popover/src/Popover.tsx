import React, { cloneElement, isValidElement, forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { PopperPortal as Popper } from '@hi-ui/popper'
import { usePopover, UsePopoverProps } from './use-popover'

const _role = 'popover'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Popover
 */
export const Popover = forwardRef<HTMLDivElement | null, PopoverProps>(
  ({ prefixCls = _prefix, className, children, title, content, ...rest }, ref) => {
    const { rootProps, getTriggerProps, getPopperProps, getOverlayProps } = usePopover(rest)

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
            {title ? <div className={`${prefixCls}__title`}>{title}</div> : null}
            <div className={`${prefixCls}__content`}>{content}</div>
          </div>
        </Popper>
      </>
    )
  }
)

export interface PopoverProps extends HiBaseHTMLProps<'div'>, UsePopoverProps {
  /**
   * 气泡卡片标题
   */
  title?: React.ReactNode
  /**
   * 	气泡卡片内容
   */
  content: React.ReactNode
}

if (__DEV__) {
  Popover.displayName = 'Popover'
}
