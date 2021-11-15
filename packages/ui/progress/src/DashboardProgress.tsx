import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useProgress, UseProgressProps } from './use-progress'
import { ProgressProvider } from './context'

const DASHBOARD_PROGRESS_PREFIX = getPrefixCls('dashboard-progress')

/**
 * TODO: What is Progress
 */
export const DashboardProgress = forwardRef<HTMLDivElement | null, DashboardProgressProps>(
  (
    {
      prefixCls = DASHBOARD_PROGRESS_PREFIX,
      role = 'DashboardProgress',
      className,
      children,
      percent: percentNum,
      content,
      status,
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
    const openWidth = 70
    const pathString = `M ${totalRadiusWidth},${totalRadiusWidth} m 0,${radius}
    a ${radius},${radius} 0 1 1 0,-${2 * radius}
    a ${radius},${radius} 0 1 1 0,${2 * radius}`
    const trailPathStyle = {
      strokeDasharray: `${strokeDash - openWidth}px ${strokeDash}px`,
      strokeDashoffset: `-${openWidth / 2}px`,
      transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease',
    }
    const strokePathStyle = {
      strokeDasharray: `${(percent / 100) * (strokeDash - openWidth)}px ${strokeDash}px`,
      strokeDashoffset: `-${openWidth / 2}px`,
      transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease',
      fill: '#fff',
    }

    const cls = cx(prefixCls, className)

    return (
      <ProgressProvider value={context}>
        <div
          ref={ref}
          className={cls}
          role={role}
          // data-value={value}
          style={{ width: radius * 2, height: radius * 2 }}
          {...rootProps}
        >
          <svg viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}>
            <path
              className={`${prefixCls}__svgbackground`}
              d={pathString}
              fillOpacity="0"
              strokeLinecap="round"
              style={trailPathStyle}
            />
            <path
              className={`${prefixCls}__dashboard ${prefixCls}__dashboard--${status}`}
              d={pathString}
              strokeLinecap="round"
              style={strokePathStyle}
            />
          </svg>
          {showInfo && (
            <div className={`${prefixCls}__text ${prefixCls}__text--${status}`}>
              {content || `${percent}%`}
            </div>
          )}
        </div>
      </ProgressProvider>
    )
  }
)

export interface DashboardProgressProps extends HiBaseHTMLProps<'div'>, UseProgressProps {}

if (__DEV__) {
  DashboardProgress.displayName = 'DashboardProgress'
}
