import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useProgress, UseProgressProps } from './use-progress'
import { ProgressProvider } from './context'

const PROGRESS_PREFIX = getPrefixCls('progress')

/**
 * TODO: What is Progress
 */
export const Progress = forwardRef<HTMLDivElement | null, ProgressProps>(
  (
    {
      prefixCls = PROGRESS_PREFIX,
      role = 'progress',
      className,
      children,
      value = 0,
      bufferValue = 0,
      color = '#2d8cf0',
      formatText,
      mode = 'determinate',
      textPlacement,
      style,
      ...rest
    },
    ref
  ) => {
    // TODO: 使用 自定义hook 抽离逻辑，若不需要可以移除
    const { rootProps, ...context } = useProgress(rest)

    const rate = value / 100
    const bufferRate = bufferValue / 100
    const cls = cx(prefixCls, className, mode === 'indeterminate' && `${prefixCls}__indeterminate`)

    return (
      <ProgressProvider value={context}>
        <div
          ref={ref}
          className={cls}
          role={role}
          // data-value={value}
          style={{ ...style, color }}
          {...rootProps}
        >
          <span
            style={{ transform: `scaleX(${bufferRate})` }}
            className={`${prefixCls}__buffer`}
            aria-label="buffer"
          />
          <span
            style={{ transform: `scaleX(${rate})` }}
            className={`${prefixCls}__value`}
            aria-label="value"
          />
        </div>
      </ProgressProvider>
    )
  }
)

export interface ProgressProps extends HiBaseHTMLProps<'div'>, UseProgressProps {}

if (__DEV__) {
  Progress.displayName = 'Progress'
}
