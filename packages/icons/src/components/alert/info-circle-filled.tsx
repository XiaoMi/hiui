
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-info-circle-filled')

export const InfoCircleFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14250"  ><path d="M512 78.933333c239.168 0 433.066667 193.898667 433.066667 433.066667S751.146667 945.066667 512 945.066667 78.933333 751.146667 78.933333 512 272.853333 78.933333 512 78.933333z m-42.666667 347.626667a38.4 38.4 0 1 0 0 76.8h4.266667v157.866667H448a38.4 38.4 0 1 0 0 76.8h128a38.4 38.4 0 0 0 0-76.8h-25.6v-192a42.666667 42.666667 0 0 0-42.666667-42.666667H469.333333z m42.666667-140.565333a49.066667 49.066667 0 1 0 0 98.133333 49.066667 49.066667 0 0 0 0-98.133333z"  p-id="14251"></path></svg>
    )
  }
)

if (__DEV__) {
  InfoCircleFilled.displayName = 'InfoCircleFilled'
}
  