import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useAnchor, UseAnchorProps, useAnchorItem, UseAnchorItemProps } from './use-anchor'
import { AnchorProvider } from './context'

const ANCHOR_PREFIX = getPrefixCls('anchor')

/**
 * TODO: What is Anchor
 */
export const Anchor = forwardRef<HTMLDivElement | null, AnchorProps>(
  ({ prefixCls = ANCHOR_PREFIX, role = 'anchor', className, children, ...rest }, ref) => {
    const { rootProps, ...context } = useAnchor(rest)

    const cls = cx(prefixCls, className)

    return (
      <AnchorProvider value={context}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          <ul className={`${prefixCls}__list`}>{children}</ul>
        </div>
      </AnchorProvider>
    )
  }
)

export interface AnchorProps extends HiBaseHTMLProps<'div'>, UseAnchorProps {}

if (__DEV__) {
  Anchor.displayName = 'Anchor'
}

const ANCHOR_ITEM_PREFIX = getPrefixCls('anchor-item')

/**
 * TODO: What is AnchorItem
 */
export const AnchorItem = forwardRef<HTMLLIElement | null, AnchorItemProps>(
  (
    {
      prefixCls = ANCHOR_ITEM_PREFIX,
      role = 'anchor-item',
      className,
      title,
      children,
      onClick,
      ...rest
    },
    ref
  ) => {
    const { rootProps, getAnchorItemProps, showActive } = useAnchorItem(rest)

    const cls = cx(prefixCls, className, showActive && `${prefixCls}--active`)

    return (
      <li ref={ref} role={role} className={cls} {...rootProps}>
        <a className={`${prefixCls}__link`} {...getAnchorItemProps()}>
          {title}
        </a>
        {children}
      </li>
    )
  }
)

export interface AnchorItemProps extends HiBaseHTMLProps<'li'>, UseAnchorItemProps {
  /**
   * 锚点项标题内容
   */
  title?: React.ReactNode
}

if (__DEV__) {
  AnchorItem.displayName = 'AnchorItem'
}
