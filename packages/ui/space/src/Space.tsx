/**
 * Space
 * easy to layout
 */
import React, { forwardRef, Children, ReactNode } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'

import { handleTransformGap } from './utils'
import { SizeType } from './types'

const SPACE_PREFIX = getPrefixCls('space')

export const Space = forwardRef<HTMLDivElement | null, SpaceProps>(
  (
    {
      prefixCls = SPACE_PREFIX,
      role = 'space',
      inline = true,
      align = 'center',
      direction = 'row',
      size = HiBaseSizeEnum.SM,
      wrap = false,
      style,
      className,
      split,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    const childCount = Children.count(children)
    const formatGap = handleTransformGap(size)

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        style={{
          flex: inline ? 'inline-flex' : 'flex',
          gap: formatGap as number,
          flexDirection: direction,
          alignItems: align,
          flexWrap: wrap ? 'wrap' : 'nowrap',
          ...style,
        }}
        {...rest}
      >
        {Children.map(children, (child, index) => {
          const showSplit = !!split && childCount > index + 1
          return (
            <>
              <div className={`${cls}__item`}>{child}</div>
              {showSplit && split}
            </>
          )
        })}
      </div>
    )
  }
)

export interface SpaceProps extends HiBaseHTMLProps<'div'> {
  /**
   * 是否 inline-flex
   * 默认: false
   */
  inline?: boolean
  /**
   * 当前轴垂直方向布局，alignItems
   * 默认: center
   */
  align?: 'flex-start' | 'flex-end' | 'center' | 'baseline'
  /**
   * flex轴方向
   * 默认: row
   */
  direction?: 'row' | 'column'
  /**
   * 间距大小，推荐使用枚举，如不符合需求可以设置具体数值
   * 默认: 'sm'
   */
  size?: SizeType
  /**
   * space-item 之间插入 dom 结构
   */
  split?: ReactNode
  /**
   * 是否换行
   * 默认: false
   */
  wrap?: boolean
}

if (__DEV__) {
  Space.displayName = 'Space'
}
