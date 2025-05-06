import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { ProgressProps } from './Progress'

const CIRCLE_PROGRESS_PREFIX = getPrefixCls('circle-progress')
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

export const CircleProgress = forwardRef<HTMLDivElement | null, CircleProgressProps>(
  (
    {
      prefixCls = CIRCLE_PROGRESS_PREFIX,
      role = 'progressbar',
      className,
      children,
      percent: percentNum = 0,
      content,
      type = 'primary',
      showInfo = true,
      style,
      size = 'md',
      width,
      color,
      ...rest
    },
    ref
  ) => {
    const _width = width || sizeMap[size]

    const percent = percentNum > 0 ? percentNum : 0
    const radius = _width / 2
    const totalRadiusWidth = radius + strokeWidthMap[size]
    const strokeDash = radius * 2 * Math.PI

    const cls = cx(prefixCls, className, `${prefixCls}--${size}`)

    return (
      <div
        ref={ref}
        className={cls}
        role={role}
        style={{ width: _width, height: _width }}
        {...rest}
      >
        <svg viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}>
          <circle
            cx={totalRadiusWidth}
            cy={totalRadiusWidth}
            r={radius}
            style={{ strokeWidth: strokeWidthMap[size] }}
            className={cx(`${prefixCls}__background`)}
          />
          <circle
            cx={totalRadiusWidth}
            cy={totalRadiusWidth}
            r={radius}
            style={{ strokeWidth: strokeWidthMap[size], stroke: color }}
            className={`${prefixCls}__circle ${prefixCls}__circle--${type}`}
            strokeDasharray={`${strokeDash} ${strokeDash}`}
            strokeDashoffset={`${strokeDash * ((100 - percent) / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        {showInfo && (
          <div className={`${prefixCls}__text ${prefixCls}__text--${type}`}>
            {content !== undefined ? content : `${percent}%`}
          </div>
        )}
      </div>
    )
  }
)

export interface CircleProgressProps
  extends Omit<HiBaseHTMLProps<'div'>, keyof ProgressProps>,
    ProgressProps {}

if (__DEV__) {
  CircleProgress.displayName = 'CircleProgress'
}
