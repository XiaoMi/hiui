import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'

const RESULT_PREFIX = getPrefixCls('result')

/**
* TODO: What is Result
*/
export const Result = forwardRef<HTMLDivElement | null, ResultProps>(
  (
    {
      prefixCls = RESULT_PREFIX,
      role = 'result',
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {children}
      </div>
    )
  }
)

export interface ResultProps extends HiBaseHTMLProps<'div'> {

}

if (__DEV__) {
  Result.displayName = 'Result'
}
