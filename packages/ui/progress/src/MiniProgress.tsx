import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { ProgressProps } from './Progress'

const MINI_PROGRESS_PREFIX = getPrefixCls('mini-progress')

export const MiniProgress = forwardRef<HTMLDivElement | null, MiniProgressProps>(
  (
    {
      prefixCls = MINI_PROGRESS_PREFIX,
      role = 'progressbar',
      className,
      children,
      percent: percentNum = 0,
      icon,
      content,
      type = 'primary',
      showInfo = true,
      style,
      width,
      color,
      ...rest
    },
    ref
  ) => {
    const _width = width || 16

    const percent = percentNum > 0 ? percentNum : 0
    const radius = _width / 2
    const totalRadiusWidth = radius + 2
    const strokeDash = radius * 2 * Math.PI

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} className={cls} role={role} {...rest}>
        {icon || (
          <svg
            viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}
            style={{ width: _width, height: _width }}
          >
            <circle
              cx={totalRadiusWidth}
              cy={totalRadiusWidth}
              r={radius}
              style={{ strokeWidth: 2 }}
              className={cx(`${prefixCls}__background`)}
            />
            <circle
              cx={totalRadiusWidth}
              cy={totalRadiusWidth}
              r={radius}
              style={{ strokeWidth: 2, stroke: color }}
              className={`${prefixCls}__circle ${prefixCls}__circle--${type}`}
              strokeDasharray={`${strokeDash} ${strokeDash}`}
              strokeDashoffset={`${strokeDash * ((100 - percent) / 100)}`}
              strokeLinecap="round"
            />
          </svg>
        )}
        {showInfo && (
          <div className={`${prefixCls}__text ${prefixCls}__text--${type}`}>
            {content !== undefined ? content : `${percent}%`}
          </div>
        )}
      </div>
    )
  }
)

export interface MiniProgressProps extends HiBaseHTMLProps<'div'>, ProgressProps {
  icon?: React.ReactNode
}

if (__DEV__) {
  MiniProgress.displayName = 'MiniProgress'
}
