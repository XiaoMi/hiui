
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../../@types/props'

const _prefix = getPrefixCls('icon-folder-open-outlined')

export const FolderOpenOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, className, children, size, style: styleProp, ...rest }, ref) => {
    const cls = cx(prefixCls, className)
    const style = { fontSize: size, ...styleProp }

    return (
      <svg className={cls} ref={ref} role="icon" style={style} {...rest}   viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19425"  ><path d="M81.621333 778.666667v-533.333334a102.4 102.4 0 0 1 102.4-102.4h163.242667c29.248 0 57.109333 12.501333 76.544 34.346667l47.146667 53.056c4.864 5.461333 11.84 8.597333 19.157333 8.597333h248.576a102.4 102.4 0 0 1 102.4 102.4v42.666667a38.4 38.4 0 1 1-76.8 0v-42.666667a25.6 25.6 0 0 0-25.6-25.6H490.112a102.421333 102.421333 0 0 1-76.544-34.389333l-47.146667-53.013333a25.642667 25.642667 0 0 0-19.157333-8.597334H184.021333a25.6 25.6 0 0 0-25.6 25.6v533.333334a25.6 25.6 0 0 0 25.6 25.6h384a38.4 38.4 0 1 1 0 76.8h-384a102.4 102.4 0 0 1-102.4-102.4z" p-id="19426"></path><path d="M839.936 366.933333c65.664 0 114.346667 60.928 99.882667 124.992l-69.930667 309.333334a102.4 102.4 0 0 1-99.861333 79.786666H200.106667c-65.664 0-114.346667-60.906667-99.882667-124.970666l69.930667-309.333334a102.4 102.4 0 0 1 99.861333-79.786666h569.92z m-569.92 76.8a25.6 25.6 0 0 0-24.96 19.946667l-69.930667 309.333333a25.6 25.6 0 0 0 24.96 31.253334h569.941334a25.6 25.6 0 0 0 24.96-19.946667l69.930666-309.333333a25.6 25.6 0 0 0-24.96-31.253334H269.994667z" p-id="19427"></path></svg>
    )
  }
)

if (__DEV__) {
  FolderOpenOutlined.displayName = 'FolderOpenOutlined'
}
  