import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import RightItem from './RightItem'
import CrossItem from './CrossItem'

const _role = 'timeline'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Timeline
 */
export const Timeline = forwardRef<HTMLDivElement | null, TimelineProps>(
  (
    { prefixCls = _prefix, role = _role, className, children, type = 'default', data, ...rest },
    ref
  ) => {
    const cls = cx(prefixCls, className, `${prefixCls}--${type}`)

    const renderItem = useCallback<(item: TimelineItem, index: number) => React.ReactNode>(
      (item, index) => {
        if (type === 'default') {
          return <CrossItem {...item} key={index} />
        }
        if (type === 'right') {
          return <RightItem {...item} key={index} />
        }
        if (type === 'cross') {
          return <CrossItem {...item} key={index} />
        }
      },
      [type]
    )

    const renderGroup = useCallback<(item: TimelineGroupItem, index: number) => React.ReactNode>(
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
            if ((item as TimelineGroupItem).groupTitle) {
              return renderGroup(item as TimelineGroupItem, index)
            } else {
              return renderItem(item as TimelineItem, index)
            }
          })}
        </ul>
      </div>
    )
  }
)

export interface TimelineProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties

  /**
   * 时间轴类型
   */
  type?: 'default' | 'right' | 'cross'
  /**
   * 时间轴数据
   */
  data: TimelineGroupItem[] | TimelineItem[]
}
export interface TimelineItem {
  title: string | React.ReactNode
  content?: string | React.ReactNode
  timestamp?: string
  extraTime?: string
  icon?: React.ReactNode
}
export interface TimelineGroupItem {
  groupTitle: string | React.ReactNode
  children: TimelineItem[]
}

if (__DEV__) {
  Timeline.displayName = 'Timeline'
}
