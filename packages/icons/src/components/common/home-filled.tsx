
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-home-filled')

export const HomeFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="24671"  ><path d="M149.333333 425.28a64 64 0 0 1 27.776-52.757333l298.666667-205.141334a64 64 0 0 1 72.448 0l298.666667 205.141334A64 64 0 0 1 874.666667 425.28V803.84a64 64 0 0 1-64 64h-128a42.666667 42.666667 0 0 1-42.666667-42.666667v-163.136a64 64 0 0 0-64-64h-128a64 64 0 0 0-64 64v163.136a42.666667 42.666667 0 0 1-42.666667 42.666667h-128a64 64 0 0 1-64-64V425.28z" p-id="24672"></path><path d="M842.666667 803.84V425.301333c0-10.538667-5.184-20.437333-13.866667-26.410666l-298.666667-205.12a32.021333 32.021333 0 0 0-36.266666 0l-298.666667 205.12c-8.682667 5.973333-13.866667 15.872-13.866667 26.410666V803.84a32 32 0 0 0 32 32h128a10.666667 10.666667 0 0 0 10.666667-10.666667v-163.157333a96 96 0 0 1 96-96h128a96 96 0 0 1 96 96v163.157333a10.666667 10.666667 0 0 0 10.666667 10.666667h128a32 32 0 0 0 32-32z m64 0a96 96 0 0 1-96 96h-128a74.666667 74.666667 0 0 1-74.666667-74.666667v-163.157333a32 32 0 0 0-32-32h-128a32 32 0 0 0-32 32v163.157333a74.666667 74.666667 0 0 1-74.666667 74.666667h-128a96 96 0 0 1-96-96V425.301333c0-31.637333 15.573333-61.226667 41.642667-79.146666l298.666667-205.12a96 96 0 0 1 108.714666 0l298.666667 205.12a96.021333 96.021333 0 0 1 41.642667 79.146666V803.84z" p-id="24673"></path></svg>
    )
  }
)

if (__DEV__) {
  HomeFilled.displayName = 'HomeFilled'
}
  