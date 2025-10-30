
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-file-music-filled')

export const FileMusicFilled = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10672"  ><path d="M613.376 96a44.8 44.8 0 0 1 31.658667 13.12l205.845333 205.845333a44.8 44.8 0 0 1 13.12 31.658667V832a96 96 0 0 1-96 96H256A96 96 0 0 1 160 832V192A96 96 0 0 1 256 96h357.376zM512 416a21.333333 21.333333 0 0 0-21.333333 21.333333v160.746667a85.333333 85.333333 0 1 0 42.666666 73.92v-178.24c15.637333 17.706667 42.666667 28.906667 64 28.906667l-0.021333-0.021334c35.349333 0 70.976-33.322667 48.896-60.906666-12.074667-15.104-33.365333-24.405333-70.208-24.405334h-42.666667a21.333333 21.333333 0 0 0-21.333333-21.333333z" p-id="10673"></path></svg>
    )
  }
)

if (__DEV__) {
  FileMusicFilled.displayName = 'FileMusicFilled'
}
  