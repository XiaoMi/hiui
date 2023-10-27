
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-text-extraction-outlined')

export const TextExtractionOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M192 682.666667v106.666666a42.666667 42.666667 0 0 0 39.466667 42.56L234.666667 832h106.666666v85.333333h-106.666666a128 128 0 0 1-128-128v-106.666666h85.333333z m725.333333 0v106.666666a128 128 0 0 1-128 128h-106.666666v-85.333333h106.666666a42.666667 42.666667 0 0 0 42.56-39.466667L832 789.333333v-106.666666h85.333333zM512 256a42.666667 42.666667 0 0 1 38.912 25.173333l192 426.666667a42.666667 42.666667 0 1 1-77.824 34.986667L609.194667 618.666667h-194.410667l-55.893333 124.16a42.666667 42.666667 0 1 1-77.802667-34.986667l192-426.666667A42.666667 42.666667 0 0 1 512 256z m0 146.645333L453.184 533.333333h117.632L512 402.645333zM341.333333 106.666667v85.333333h-106.666666a42.666667 42.666667 0 0 0-42.56 39.466667L192 234.666667v106.666666H106.666667v-106.666666a128 128 0 0 1 128-128h106.666666z m448 0a128 128 0 0 1 128 128v106.666666h-85.333333v-106.666666a42.666667 42.666667 0 0 0-39.466667-42.56L789.333333 192h-106.666666V106.666667h106.666666z" p-id="15666"></path></svg>
    )
  }
)

if (__DEV__) {
  TextExtractionOutlined.displayName = 'TextExtractionOutlined'
}
  