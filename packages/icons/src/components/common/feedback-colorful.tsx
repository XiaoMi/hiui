
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-feedback-colorful')

export const FeedbackColorful = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19694"  ><path d="M428.970667 810.666667A346.389333 346.389333 0 1 0 83.114667 483.626667a344.064 344.064 0 0 0 93.930666 218.965333l-33.834666 49.770667A37.333333 37.333333 0 0 0 174.101333 810.666667h237.312v-0.362667c5.461333 0.256 10.986667 0.362667 16.554667 0.362667h1.002667z" fill="#336DF4" p-id="19695"></path><path d="M868.309333 789.418667a224.597333 224.597333 0 1 0-156.309333 77.952v0.448h139.285333a37.333333 37.333333 0 0 0 30.72-58.538667l-13.696-19.861333z" fill="#33D6C0" p-id="19696"></path></svg>
    )
  }
)

if (__DEV__) {
  FeedbackColorful.displayName = 'FeedbackColorful'
}
  