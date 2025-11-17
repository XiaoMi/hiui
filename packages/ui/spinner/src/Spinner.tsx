import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'

const SPINNER_PREFIX = getPrefixCls('spinner')

/**
 * 加载器
 */
export const Spinner = forwardRef<HTMLElement | null, SpinnerProps>(
  (
    {
      prefixCls = SPINNER_PREFIX,
      role = 'spinner',
      className,
      children,
      size = 'md',
      color,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className, typeof size === 'string' && prefixCls + `--size-${size}`)

    return (
      <i
        ref={ref}
        className={cls}
        {...rest}
        style={{ color, ...(typeof size === 'number' ? { fontSize: size } : {}), ...rest.style }}
      >
        <svg
          className={`${prefixCls}__icon`}
          width="40"
          height="40"
          viewBox="0 0 40 40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.70102 8.58595C8.8867 8.40013 9.10717 8.2527 9.34983 8.15209C9.5925 8.05147 9.8526 7.99964 10.1153 7.99954C10.378 7.99945 10.6381 8.0511 10.8809 8.15154C11.1236 8.25198 11.3442 8.39925 11.53 8.58494C11.7158 8.77062 11.8632 8.99109 11.9639 9.23375C12.0645 9.47642 12.1163 9.73652 12.1164 9.99922C12.1165 10.2619 12.0649 10.5221 11.9644 10.7648C11.864 11.0075 11.7167 11.2281 11.531 11.4139C10.4091 12.5339 9.51951 13.8646 8.91354 15.3295C8.30756 16.7944 7.9971 18.3646 8 19.9499C8 26.607 13.374 31.9999 20 31.9999C26.626 31.9999 32 26.607 32 19.9499C32 19.4195 32.2107 18.9108 32.5858 18.5357C32.9609 18.1607 33.4696 17.9499 34 17.9499C34.5304 17.9499 35.0391 18.1607 35.4142 18.5357C35.7893 18.9108 36 19.4195 36 19.9499C36 28.8129 28.838 35.9999 20 35.9999C11.162 35.9999 4 28.8129 4 19.9499C4 15.6299 5.71199 11.5769 8.70102 8.58595V8.58595Z" />
        </svg>
      </i>
    )
  }
)

export interface SpinnerProps extends HiBaseHTMLProps<'i'> {
  /**
   * 尺寸
   */
  size?: number | Omit<HiBaseSizeEnum, 'xs'>
  /**
   * 颜色
   */
  color?: React.CSSProperties['color']
}

if (__DEV__) {
  Spinner.displayName = 'Spinner'
}
