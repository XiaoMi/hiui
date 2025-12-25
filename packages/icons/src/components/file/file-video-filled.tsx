
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-video-filled')

export const FileVideoFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5014"  ><path d="M613.376 96a44.8 44.8 0 0 1 31.658667 13.12l205.845333 205.845333a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h357.376zM379.733333 468.010667c-14.144 0-25.6 11.157333-25.6 24.917333v174.378667c0 13.76 11.456 24.896 25.6 24.896h214.272c14.122667 0 25.6-11.136 25.6-24.896v-25.642667a4.266667 4.266667 0 0 1 5.824-3.946667l55.296 21.845334c16.149333 3.925333 31.808-7.957333 31.808-24.170667v-110.570667c0-16.213333-15.658667-28.096-31.786666-24.170666l-55.317334 21.845333a4.266667 4.266667 0 0 1-5.824-3.946667v-25.621333c0-13.781333-11.477333-24.938667-25.6-24.938667H379.733333z" p-id="5015"></path></svg>
    )
  }
)

if (__DEV__) {
  FileVideoFilled.displayName = 'FileVideoFilled'
}
  