import React, { forwardRef, Children, ReactDOM } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

import { handleTransformGap } from './utils'
import { SizeEnum, SizeType } from './types'

const SPACE_PREFIX = getPrefixCls('space')

/**
 * TODO: What is Space
 */
export const Space = forwardRef<HTMLDivElement | null, SpaceProps>(
  (
    {
      prefixCls = SPACE_PREFIX,
      role = 'space',
      className,
      children,
      align = 'start',
      direction = 'row',
      size = SizeEnum.Small,
      split,
      wrap,
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
      <div ref={ref} role={role} className={cls} style={{ gap: formatGap as string }} {...rest}>
        {Children.map(children, (child, index) => {
          // child dom
          const childContent =
            split && childCount < index + 1 ? (
              <>
                {split}
                {child}
              </>
            ) : (
              child
            )
          return <div className={`${prefixCls}__item`}>{childContent}</div>
        })}
      </div>
    )
  }
)

export interface SpaceProps extends HiBaseHTMLProps<'div'> {
  align?: 'start' | 'end' | 'center' | 'baseline'
  direction?: 'row' | 'column'
  size?: SizeType
  split?: ReactDOM
  wrap?: boolean
}

if (__DEV__) {
  Space.displayName = 'Space'
}
