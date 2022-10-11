import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps, HiBaseSizeEnum } from '@hi-ui/core'

const SPINNER_PREFIX = getPrefixCls('spinner')

/**
 * TODO: What is Spinner
 */
export const Spinner = forwardRef<HTMLElement | null, SpinnerProps>(
  (
    { prefixCls = SPINNER_PREFIX, role = 'spinner', className, children, size = 14, ...rest },
    ref
  ) => {
    const cls = cx(prefixCls, className, typeof size === 'string' && prefixCls + `--size-${size}`)

    return (
      <i
        ref={ref}
        className={cls}
        {...rest}
        style={{ ...(typeof size === 'number' ? { fontSize: size } : {}), ...rest.style }}
      >
        <svg
          className={`${prefixCls}__icon`}
          viewBox="0 0 18 18"
          version="1.1"
          width="0.8em"
          height="0.8em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              d="m9 18c-4.9706 0-9-4.0294-9-9 0-4.9706 4.0294-9 9-9 4.9706 0 9 4.0294 9 9 0 4.9706-4.0294 9-9 9zm0-2c3.866 0 7-3.134 7-7 0-3.866-3.134-7-7-7-3.866 0-7 3.134-7 7 0 3.866 3.134 7 7 7z"
              opacity=".15"
            />
            <path d="m15.547 2.8242c0.37904 0.40168 0.36068 1.0346-0.040996 1.4136-0.40168 0.37904-1.0346 0.36068-1.4136-0.040996-1.315-1.3935-3.1381-2.1969-5.0922-2.1969-3.866 0-7 3.134-7 7 0 0.55228-0.44772 1-1 1s-1-0.44772-1-1c0-4.9706 4.0294-9 9-9 2.5103 0 4.8578 1.0343 6.5468 2.8242z" />
          </g>
        </svg>
      </i>
    )
  }
)

export interface SpinnerProps extends HiBaseHTMLProps<'i'> {
  /**
   * 自定义尺寸
   */
  size?: number | HiBaseSizeEnum
}

if (__DEV__) {
  Spinner.displayName = 'Spinner'
}
