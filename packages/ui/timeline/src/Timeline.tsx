import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import RightItem from './RightItem'
import CrossItem from './CrossItem'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { TimelineMergedItem, TimelineDataItem, TimelineGroupDataItem } from './types'

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

    const renderItem = useCallback<(item: TimelineDataItem, index: number) => React.ReactNode>(
      (item, index) => {
        if (type === 'default') {
          return <CrossItem {...item} key={index} />
        }
        if (type === 'right') {
          return <RightItem {...item} key={index} />
        }
        if (type === 'cross') {
          return <RightItem {...item} key={index} />
        }
      },
      [type]
    )

    const renderGroup = useCallback<
      (item: TimelineGroupDataItem, index: number) => React.ReactNode
    >(
      (item, index) => {
        return (
          <div key={index} className={cx('timeline__group')}>
            <div
              className={cx('timeline__group-title', {
                'timeline__group-title--first': index === 0,
              })}
            >
              {item.groupTitle}
              {index !== 0 && <div className="item__line" />}
            </div>
            <div>
              {item.children.map((i, idx) => {
                return renderItem(i, idx)
              })}
            </div>
          </div>
        )
      },
      [renderItem]
    )

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        <ul>
          {data.map((item, index) => {
            if ((item as TimelineGroupDataItem).groupTitle) {
              return renderGroup(item as TimelineGroupDataItem, index)
            } else {
              return renderItem(item as TimelineDataItem, index)
            }
          })}
        </ul>
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
