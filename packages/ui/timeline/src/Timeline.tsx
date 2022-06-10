import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { TimelinePlacementEnum } from './types'
import { HorizontalTimelineProps, HorizontalTimeline } from './HorizontalTimeline'
import { VerticalTimeline, VerticalTimelineProps } from './VerticalTimeline'

const _role = 'timeline'
const _prefix = getPrefixCls(_role)

/**
 * 时间轴
 */
export const Timeline = forwardRef<HTMLDivElement | null, TimelineProps>(
  ({ prefixCls = _prefix, className, placement = 'vertical', ...rest }, ref) => {
    const cls = cx(className, `${prefixCls}--placement-${placement}`)

    switch (placement) {
      case 'horizontal':
        return <HorizontalTimeline ref={ref} prefixCls={prefixCls} className={cls} {...rest} />
      case 'vertical':
        return <VerticalTimeline ref={ref} prefixCls={prefixCls} className={cls} {...rest} />
    }
  }
)

export interface TimelineProps extends HorizontalTimelineProps, VerticalTimelineProps {
  /**
   * 布局方式
   */
  placement?: TimelinePlacementEnum
}

if (__DEV__) {
  Timeline.displayName = 'Timeline'
}
