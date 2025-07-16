import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { TimelineItemPlacementEnum, TimelineMergedItem } from './types'
import { DotIcon } from './DotIcon'

const _role = 'timeline'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

/**
 * 垂直时间轴
 */
export const HorizontalTimeline = forwardRef<HTMLDivElement | null, HorizontalTimelineProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data = NOOP_ARRAY,
      itemPlacement = 'left',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className={cx(`${prefixCls}-item`, `${prefixCls}-item--placement-${itemPlacement}`)}
            >
              <div className={`${prefixCls}-item__top`}>
                <div className={`${prefixCls}-item__time`}>{item.timestamp}</div>
              </div>
              <div className={`${prefixCls}-item__middle`}>
                <div className={`${prefixCls}-item__line`}></div>
                <DotIcon
                  prefixCls={`${prefixCls}-item`}
                  icon={item.icon}
                  color={item.dotColor}
                  type={item.dotType}
                />
              </div>
              <div className={`${prefixCls}-item__bottom`}>
                <div className={`${prefixCls}-item__title`}>{item.title}</div>
                <div className={`${prefixCls}-item__content`}>{item.content}</div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)

export interface HorizontalTimelineProps extends HiBaseHTMLProps<'div'> {
  /**
   * 时间轴数据
   */
  data: TimelineMergedItem[]
  /**
   * 轴元素对齐方式，仅在 placement="vertical" 时有效
   */
  itemPlacement?: TimelineItemPlacementEnum
}

if (__DEV__) {
  HorizontalTimeline.displayName = 'Timeline'
}
