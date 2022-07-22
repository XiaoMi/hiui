import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import {
  TimelineMergedItem,
  TimelineDataItem,
  TimelineGroupDataItem,
  TimelineTypeEnum,
} from './types'
import { CrossItem } from './CrossItem'
import { RightItem } from './RightItem'

const _role = 'timeline'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

/**
 * 水平时间轴
 */
export const VerticalTimeline = forwardRef<HTMLDivElement | null, VerticalTimelineProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      type = 'default',
      data = NOOP_ARRAY,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, `${prefixCls}--type-${type}`)

    const renderItem = useCallback(
      (item: TimelineDataItem, index: number) => {
        if (type === 'default') {
          return <CrossItem {...item} key={index} prefixCls={`${prefixCls}-item`} />
        }
        if (type === 'right') {
          return <RightItem {...item} key={index} prefixCls={`${prefixCls}-item`} />
        }
        if (type === 'cross') {
          return <RightItem {...item} key={index} prefixCls={`${prefixCls}-item`} />
        }
      },
      [prefixCls, type]
    )

    const renderGroup = useCallback(
      (item: TimelineGroupDataItem, index: number) => {
        return (
          <div key={index} className={`${prefixCls}-group`}>
            <div
              className={cx(
                `${prefixCls}-group-title`,
                index === 0 && `${prefixCls}-group-title--first`
              )}
            >
              {item.groupTitle}
              {index !== 0 && <div className={`${prefixCls}-item__line`} />}
            </div>
            <div>
              {item.children.map((subItem, idx) => {
                return renderItem(subItem, idx)
              })}
            </div>
          </div>
        )
      },
      [prefixCls, renderItem]
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {data.map((item, index) => {
          if ('groupTitle' in item) {
            return renderGroup(item as TimelineGroupDataItem, index)
          }

          return renderItem(item as TimelineDataItem, index)
        })}
      </div>
    )
  }
)

export interface VerticalTimelineProps extends HiBaseHTMLProps<'div'> {
  /**
   * 时间轴数据
   */
  data: TimelineMergedItem[]
  /**
   * 时间轴类型，仅在 placement="vertical" 时有效
   */
  type?: TimelineTypeEnum
}

if (__DEV__) {
  VerticalTimeline.displayName = 'VerticalTimeline'
}
