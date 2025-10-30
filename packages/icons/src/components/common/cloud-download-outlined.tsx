
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-cloud-download-outlined')

export const CloudDownloadOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14581"  ><path d="M57.6 629.333333c0-103.146667 62.016-191.68 150.72-230.613333C222.336 255.146667 343.381333 142.933333 490.666667 142.933333c148.970667 0 271.104 114.816 282.794666 260.8C883.541333 426.026667 966.4 523.349333 966.4 640c0 133.12-107.946667 241.066667-241.066667 241.066667H309.333333c-139.029333 0-251.733333-112.704-251.733333-251.733334z m76.8 0a174.933333 174.933333 0 0 0 174.933333 174.933334H725.333333a164.266667 164.266667 0 0 0 8.469334-328.32l-38.122667-1.941334 1.706667-38.101333c0.128-3.306667 0.213333-6.336 0.213333-9.237333 0-114.282667-92.650667-206.933333-206.933333-206.933334-114.026667 0-206.506667 92.224-206.933334 206.165334l-0.085333 28.074666-26.794667 8.426667A175.04 175.04 0 0 0 134.4 629.333333z" p-id="14582"></path><path d="M472.938667 451.328a38.4 38.4 0 1 1 76.8 0V661.333333a38.4 38.4 0 0 1-76.8 0v-210.005333z" p-id="14583"></path><path d="M570.176 586.816a38.4 38.4 0 1 1 54.314667 54.314667l-84.864 84.842666a38.4 38.4 0 1 1-54.293334-54.293333l84.842667-84.864z" p-id="14584"></path><path d="M400.469333 641.130667a38.4 38.4 0 1 1 54.314667-54.314667l84.842667 84.864a38.4 38.4 0 1 1-54.293334 54.293333l-84.864-84.842666z" p-id="14585"></path></svg>
    )
  }
)

if (__DEV__) {
  CloudDownloadOutlined.displayName = 'CloudDownloadOutlined'
}
  