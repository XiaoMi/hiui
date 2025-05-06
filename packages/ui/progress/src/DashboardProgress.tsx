import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { ProgressProps } from './Progress'

const DASHBOARD_PROGRESS_PREFIX = getPrefixCls('dashboard-progress')

const sizeMap = {
  sm: 48,
  md: 64,
  lg: 80,
}

const strokeWidthMap = {
  sm: 2,
  md: 4,
  lg: 8,
}

export const DashboardProgress = forwardRef<HTMLDivElement | null, DashboardProgressProps>(
  (
    {
      prefixCls = DASHBOARD_PROGRESS_PREFIX,
      role = 'progressbar',
      className,
      children,
      type = 'primary',
      percent: percentNum = 0,
      content,
      radius: radiusThis,
      width,
      showInfo = true,
      style,
      size = 'md',
      color,
      ...rest
    },
    ref
  ) => {
    const percent = percentNum > 0 ? percentNum : 0
    const _width = width || sizeMap[size]
    const radius = _width / 2
    const totalRadiusWidth = radius + strokeWidthMap[size]
    const strokeDash = radius * 2 * Math.PI
    const openWidth = strokeDash / 6
    const pathString = `M ${totalRadiusWidth},${totalRadiusWidth} m 0,${radius}
    a ${radius},${radius} 0 1 1 0,-${2 * radius}
    a ${radius},${radius} 0 1 1 0,${2 * radius}`
    const trailPathStyle = {
      strokeDasharray: `${strokeDash - openWidth}px ${strokeDash}px`,
      strokeDashoffset: `-${openWidth / 2}px`,
      transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease',
      strokeWidth: strokeWidthMap[size],
    }
    const strokePathStyle = {
      strokeDasharray: `${(percent / 100) * (strokeDash - openWidth)}px ${strokeDash}px`,
      strokeDashoffset: `-${openWidth / 2}px`,
      transition: 'stroke-dashoffset 0.3s ease 0s, stroke 0.3s ease',
      fill: '#fff',
      strokeWidth: strokeWidthMap[size],
      stroke: color,
    }

    const cls = cx(prefixCls, className)

    return (
      <div
        ref={ref}
        className={cls}
        role={role}
        aria-valuenow={percent}
        style={{ width: _width, height: _width }}
        {...rest}
      >
        <svg viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}>
          <path
            className={`${prefixCls}__background`}
            d={pathString}
            fillOpacity="0"
            strokeLinecap="round"
            style={trailPathStyle}
          />
          <path
            className={`${prefixCls}__dashboard ${prefixCls}__dashboard--${type}`}
            d={pathString}
            strokeLinecap="round"
            style={strokePathStyle}
          />
        </svg>
        {showInfo ? (
          <div className={`${prefixCls}__text ${prefixCls}__text--${type}`}>
            {content !== undefined ? content : `${percent}%`}
          </div>
        ) : null}
      </div>
    )
  }
)

export interface DashboardProgressProps
  extends Omit<HiBaseHTMLProps<'div'>, keyof ProgressProps>,
    ProgressProps {}

if (__DEV__) {
  DashboardProgress.displayName = 'DashboardProgress'
}
