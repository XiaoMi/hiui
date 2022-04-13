import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { TimelineMergedItem, TimelineDataItem, TimelineGroupDataItem } from './types'
import { CrossItem } from './CrossItem'
import { RightItem } from './RightItem'

const _role = 'timeline'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

/**
 * TODO: What is Timeline
 */
export const Timeline = forwardRef<HTMLDivElement | null, TimelineProps>(
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
    const cls = cx(prefixCls, className, `${prefixCls}--${type}`)

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
          <div key={index} className={cx(`${prefixCls}-group`)}>
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

export interface TimelineProps extends HiBaseHTMLProps<'div'> {
  /**
   * 时间轴类型
   */
  type?: 'default' | 'right' | 'cross'
  /**
   * 时间轴数据
   */
  data: TimelineMergedItem[]
}

if (__DEV__) {
  Timeline.displayName = 'Timeline'
}
