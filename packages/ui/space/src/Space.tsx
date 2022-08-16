import React, { forwardRef, Children, Fragment, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { invariant, __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
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
      size = 'sm',
      wrap = true,
      style,
      className,
      separator,
      split,
      children,
      ...rest
    },
    ref
  ) => {
    const separatorMemo = useMemo(() => {
      if (!isNullish(split)) {
        if (isNullish(separator)) {
          return split
        }

        invariant(false, 'Please use `separator` prop instead of `split` in Result.')
      }

      return separator
    }, [split, separator])

    const childCount = Children.count(children)
    const formatGap = handleTransformGap(size)

    const cls = cx(prefixCls, className)

    return (
      <div
        ref={ref}
        role={role}
        className={cx(cls, { [`${prefixCls}--column-block`]: !inline && direction === 'column' })}
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
          const showSplit = !isNullish(separatorMemo) && childCount > index + 1
          return (
            <Fragment key={index}>
              <div className={`${prefixCls}__item`}>{child}</div>
              {showSplit && separatorMemo}
            </Fragment>
          )
        })}
      </div>
    )
  }
)

export interface SpaceProps extends HiBaseHTMLProps<'div'> {
  /**
   * 是否设置盒模型为内联模式
   */
  inline?: boolean
  /**
   * 当前轴的对齐方式
   */
  align?: SpaceAlignEnum
  /**
   * 设置轴方向，支持水平和纵向设置
   */
  direction?: SpaceDirectionEnum
  /**
   * 间距大小，推荐使用内置枚举尺寸，也可以设置具体数值
   */
  size?: SpaceSizeEnum
  /**
   * 在每个元素之间插入自定义分隔符
   */
  separator?: React.ReactNode
  /**
   * @deprecated 请使用 `separator` prop 替代
   */
  split?: React.ReactNode
  /**
   * 是否自动换行
   */
  wrap?: boolean
}

if (__DEV__) {
  Space.displayName = 'Space'
}
