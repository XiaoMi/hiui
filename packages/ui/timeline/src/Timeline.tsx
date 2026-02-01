import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useGlobalContext } from '@hi-ui/core'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'
import { TimelinePlacementEnum } from './types'
import { HorizontalTimelineProps, HorizontalTimeline } from './HorizontalTimeline'
import { VerticalTimeline, VerticalTimelineProps } from './VerticalTimeline'

const _role = 'timeline'
const _prefix = getPrefixCls(_role)

/**
 * 时间轴
 */
export const Timeline = forwardRef<HTMLDivElement | null, TimelineProps>(
  (
    {
      prefixCls = _prefix,
      className,
      style,
      classNames: classNamesProp,
      styles: stylesProp,
      placement = 'vertical',
      ...rest
    },
    ref
  ) => {
    const globalContext = useGlobalContext() as ReturnType<typeof useGlobalContext> & {
      timeline?: { classNames?: any; styles?: any }
    }
    const { timeline: timelineConfig } = globalContext
    const { classNames, styles } = useMergeSemantic<
      TimelineSemanticClassNames,
      TimelineSemanticStyles,
      TimelineProps
    >({
      classNamesList: [timelineConfig?.classNames, classNamesProp],
      stylesList: [timelineConfig?.styles, stylesProp],
      info: { props: { ...rest, placement } },
    })

    const cls = cx(className, classNames?.root, `${prefixCls}--placement-${placement}`)

    switch (placement) {
      case 'horizontal':
        return (
          <HorizontalTimeline
            ref={ref}
            prefixCls={prefixCls}
            className={cls}
            style={{ ...style, ...styles?.root }}
            classNames={classNames}
            styles={styles}
            {...rest}
          />
        )
      case 'vertical':
        return (
          <VerticalTimeline
            ref={ref}
            prefixCls={prefixCls}
            className={cls}
            style={{ ...style, ...styles?.root }}
            classNames={classNames}
            styles={styles}
            {...rest}
          />
        )
    }
  }
)

export type TimelineSemanticName =
  | 'root'
  | 'item'
  | 'itemTime'
  | 'itemLine'
  | 'itemDot'
  | 'itemTitle'
  | 'itemContent'
export type TimelineSemanticClassNames = SemanticClassNamesType<TimelineProps, TimelineSemanticName>
export type TimelineSemanticStyles = SemanticStylesType<TimelineProps, TimelineSemanticName>
export type TimelineSemantic = ComponentSemantic<TimelineSemanticClassNames, TimelineSemanticStyles>

export interface TimelineProps
  extends Omit<HorizontalTimelineProps, 'classNames' | 'styles'>,
    Omit<VerticalTimelineProps, 'classNames' | 'styles'>,
    TimelineSemantic {
  /**
   * 布局方式
   */
  placement?: TimelinePlacementEnum
}

if (__DEV__) {
  Timeline.displayName = 'Timeline'
}
