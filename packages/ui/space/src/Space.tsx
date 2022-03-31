import React, { forwardRef, Children, Fragment } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'
import { isNullish } from '@hi-ui/type-assertion'

import { handleTransformGap } from './utils'
import { SpaceAlignEnum, SpaceDirectionEnum, SpaceSizeEnum } from './types'

const SPACE_PREFIX = getPrefixCls('space')

/**
 * Space
 * easy to layout
 */
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
          display: inline ? 'inline-flex' : 'flex',
          flexWrap: wrap ? 'wrap' : 'nowrap',
          flexDirection: direction,
          gap: formatGap,
          alignItems: align,
          ...style,
        }}
        {...rest}
      >
        {Children.map(children, (child, index) => {
          const showSplit = !isNullish(split) && childCount > index + 1
          return (
            <Fragment key={index}>
              <div className={`${cls}__item`}>{child}</div>
              {showSplit && split}
            </Fragment>
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
  align?: SpaceAlignEnum
  /**
   * flex轴方向
   * 默认: row
   */
  direction?: SpaceDirectionEnum
  /**
   * 间距大小，推荐使用枚举，如不符合需求可以设置具体数值
   * 默认: 'sm'
   */
  size?: SpaceSizeEnum
  /**
   * space-item 之间插入 dom 结构
   */
  split?: React.ReactNode
  /**
   * 是否换行
   * 默认: false
   */
  wrap?: boolean
}

if (__DEV__) {
  Space.displayName = 'Space'
}
