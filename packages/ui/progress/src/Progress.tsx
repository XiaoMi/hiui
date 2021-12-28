import React, { forwardRef, useState } from 'react'
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
      type = 'primary',
      className,
      children,
      percent = 0,
      bufferPercent = 0,
      formatText,
      size = 'md',
      mode = 'determinate',
      showInfo = true,
      placement = 'outside',
      style,
      content,
      strokeWidth,
      active = false,
      width,
      ...rest
    },
    ref
  ) => {
    // TODO: 使用 自定义hook 抽离逻辑，若不需要可以移除
    const { rootProps, ...context } = useProgress(rest)
    const [barRef, setBarRef] = useState<HTMLSpanElement | null>(null)
    const [contentRef, setContentRef] = useState<HTMLSpanElement | null>(null)

    const rate = percent / 100 > 1 ? 1 : percent / 100
    const bufferRate = bufferPercent / 100 > 1 ? 1 : bufferPercent / 100
    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--${size}`,
      mode === 'indeterminate' && `${prefixCls}__indeterminate`
    )

    const _content = content !== undefined ? content : `${rate * 100}%`
    return (
      <ProgressProvider value={context}>
        <div ref={ref} className={cls} role={role} style={{ ...style, width }} {...rootProps}>
          <div
            className={cx(`${prefixCls}__inner`, { [`${prefixCls}__inner--active`]: active })}
            style={{ height: strokeWidth }}
          >
            {!!bufferRate && (
              <span
                style={{ width: `${bufferRate * 100}%` }}
                className={`${prefixCls}__buffer`}
                aria-label="buffer"
              />
            )}
            <span
              ref={setBarRef}
              style={{ width: `${rate * 100}%` }}
              className={cx(`${prefixCls}__value`, `${prefixCls}__value--${type}`)}
              aria-label="value"
            >
              {showInfo && placement === 'inside' && barRef && barRef.clientHeight >= 14 && (
                <span
                  ref={setContentRef}
                  className={cx(`${prefixCls}__content`, {
                    [`${prefixCls}__content--right`]:
                      contentRef && contentRef?.clientWidth >= barRef?.clientWidth - 8,
                  })}
                >
                  {_content}
                </span>
              )}
            </span>
          </div>
          {showInfo && placement === 'outside' && (
            <div className={`${prefixCls}__content`}>{_content}</div>
          )}
        </div>
      </ProgressProvider>
    )
  }
)

export interface ProgressProps extends HiBaseHTMLProps<'div'>, UseProgressProps {}

if (__DEV__) {
  Progress.displayName = 'Progress'
}
