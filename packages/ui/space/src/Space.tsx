/**
 * this is a easy to layout component
 */
import React, { forwardRef, Children, ReactNode } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

import { handleTransformGap } from './utils'
import { SizeEnum, SizeType } from './types'

const SPACE_PREFIX = getPrefixCls('space')

export const Space = forwardRef<HTMLDivElement | null, SpaceProps>(
  (
    {
      prefixCls = SPACE_PREFIX,
      role = 'space',
      align = 'start',
      direction = 'row',
      size = SizeEnum.Small,
      style = {},
      className,
      split,
      wrap,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--${direction}`,
      `${prefixCls}--align--${align}`,
      wrap && `${prefixCls}--wrap`
    )

    const childCount = Children.count(children)
    const formatGap = handleTransformGap(size)

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        style={{ gap: formatGap as number, ...style }}
        {...rest}
      >
        {Children.map(children, (child, index) => {
          const childBody = <div className={`${prefixCls}__item`}>{child}</div>
          const childDom =
            split && childCount > index + 1 ? (
              <>
                {childBody}
                {split}
              </>
            ) : (
              childBody
            )
          return childDom
        })}
      </div>
    )
  }
)

export interface SpaceProps extends HiBaseHTMLProps<'div'> {
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'row' | 'column'
  size?: SizeType
  split?: ReactNode
  wrap?: boolean
}

if (__DEV__) {
  Space.displayName = 'Space'
}
