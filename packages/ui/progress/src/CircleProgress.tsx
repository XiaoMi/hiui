import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useProgress, UseProgressProps } from './use-progress'
import { ProgressProvider } from './context'

const CIRCLE_PROGRESS_PREFIX = getPrefixCls('circle-progress')

/**
 * TODO: What is CircleProgress
 */
export const CircleProgress = forwardRef<HTMLDivElement | null, CircleProgressProps>(
  (
    {
      prefixCls = CIRCLE_PROGRESS_PREFIX,
      role = 'progress',
      className,
      children,
      percent: percentNum = 0,
      content,
      type,
      radius: radiusThis,
      showInfo,
      style,
      ...rest
    },
    ref
  ) => {
    // TODO: 使用 自定义hook 抽离逻辑，若不需要可以移除
    const { rootProps, ...context } = useProgress(rest)

    const percent = percentNum > 0 ? percentNum : 0
    const radius = radiusThis > 0 ? radiusThis : 40
    const totalRadiusWidth = radius + 10
    const strokeDash = radius * 2 * Math.PI

    const cls = cx(prefixCls, className)

    return (
      <ProgressProvider value={context}>
        <div
          ref={ref}
          className={cls}
          role={role}
          style={{ width: radius * 2, height: radius * 2 }}
          {...rootProps}
        >
          <svg viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}>
            <circle
              cx={totalRadiusWidth}
              cy={totalRadiusWidth}
              r={radius}
              className={`${prefixCls}__svgbackground`}
            />
            <circle
              cx={totalRadiusWidth}
              cy={totalRadiusWidth}
              r={radius}
              className={`${prefixCls}__circle ${prefixCls}__circle--${type}`}
              strokeDasharray={`${strokeDash} ${strokeDash}`}
              strokeDashoffset={`${strokeDash * ((100 - percent) / 100)}`}
              strokeLinecap="round"
            />
          </svg>
          {showInfo && (
            <div className={`${prefixCls}__text ${prefixCls}__text--${type}`}>
              {content || `${percent}%`}
            </div>
          )}
        </div>
      </ProgressProvider>
    )
  }
)

export interface CircleProgressProps extends HiBaseHTMLProps<'div'>, UseProgressProps {}

if (__DEV__) {
  CircleProgress.displayName = 'CircleProgress'
}
