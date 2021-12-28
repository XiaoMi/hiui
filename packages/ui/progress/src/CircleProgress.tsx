import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useProgress, UseProgressProps } from './use-progress'
import { ProgressProvider } from './context'

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
      type = 'primary',
      showInfo = true,
      style,
      size = 'md',
      width,
      ...rest
    },
    ref
  ) => {
    // TODO: 使用 自定义hook 抽离逻辑，若不需要可以移除
    const { rootProps, ...context } = useProgress(rest)
    const _width = width || sizeMap[size]

    const percent = percentNum > 0 ? percentNum : 0
    const radius = _width / 2
    const totalRadiusWidth = radius + strokeWidthMap[size]
    const strokeDash = radius * 2 * Math.PI

    const cls = cx(prefixCls, className, `${prefixCls}--${size}`)

    return (
      <ProgressProvider value={context}>
        <div
          ref={ref}
          className={cls}
          role={role}
          style={{ width: _width, height: _width }}
          {...rootProps}
        >
          <svg viewBox={`0 0 ${totalRadiusWidth * 2} ${totalRadiusWidth * 2}`}>
            <circle
              cx={totalRadiusWidth}
              cy={totalRadiusWidth}
              r={radius}
              style={{ strokeWidth: strokeWidthMap[size] }}
              className={cx(`${prefixCls}__svgbackground`)}
            />
            <circle
              cx={totalRadiusWidth}
              cy={totalRadiusWidth}
              r={radius}
              style={{ strokeWidth: strokeWidthMap[size] }}
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
      </ProgressProvider>
    )
  }
)

export interface CircleProgressProps extends HiBaseHTMLProps<'div'>, UseProgressProps {}

if (__DEV__) {
  CircleProgress.displayName = 'CircleProgress'
}
