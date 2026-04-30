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
      style,
      classNames,
      styles,
      children,
      data = NOOP_ARRAY,
      itemPlacement = 'left',
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, classNames?.root)

    return (
      <div ref={ref} role={role} className={cls} style={{ ...style, ...styles?.root }} {...rest}>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className={cx(
                `${prefixCls}-item`,
                `${prefixCls}-item--placement-${itemPlacement}`,
                classNames?.item
              )}
              style={styles?.item}
            >
              <div className={`${prefixCls}-item__top`}>
                <div
                  className={cx(`${prefixCls}-item__time`, classNames?.itemTime)}
                  style={styles?.itemTime}
                >
                  {item.timestamp}
                </div>
              </div>
              <div className={`${prefixCls}-item__middle`}>
                <div
                  className={cx(`${prefixCls}-item__line`, classNames?.itemLine)}
                  style={styles?.itemLine}
                />
                <div className={cx(classNames?.itemDot)} style={styles?.itemDot}>
                  <DotIcon
                    prefixCls={`${prefixCls}-item`}
                    icon={item.icon}
                    color={item.dotColor}
                    type={item.dotType}
                  />
                </div>
              </div>
              <div className={`${prefixCls}-item__bottom`}>
                <div
                  className={cx(`${prefixCls}-item__title`, classNames?.itemTitle)}
                  style={styles?.itemTitle}
                >
                  {item.title}
                </div>
                <div
                  className={cx(`${prefixCls}-item__content`, classNames?.itemContent)}
                  style={styles?.itemContent}
                >
                  {item.content}
                </div>
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
  /**
   * 语义化 classNames（由 Timeline 传入）
   */
  classNames?: Record<string, string | undefined>
  /**
   * 语义化 styles（由 Timeline 传入）
   */
  styles?: Record<string, React.CSSProperties | undefined>
}

if (__DEV__) {
  HorizontalTimeline.displayName = 'Timeline'
}
