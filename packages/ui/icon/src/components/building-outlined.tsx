
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-building-outlined'
const _prefix = getPrefixCls(_role)

export const BuildingOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M680 64a16 16 0 0 1 16 16v352h184a16 16 0 0 1 16 16v496a16 16 0 0 1-16 16H144a16 16 0 0 1-16-16V80a16 16 0 0 1 16-16h536z m-56 72H200v752h92V680a16 16 0 0 1 16-16h208a16 16 0 0 1 16 16v208h92V136z m200 368h-128v384h128V504zM460 736h-96v152h96v-152z m-104-304c4.42 0 8 3.184 8 7.112v113.776c0 3.928-3.58 7.112-8 7.112h-56c-4.42 0-8-3.184-8-7.112v-113.776c0-3.928 3.58-7.112 8-7.112h56z m168 0c4.42 0 8 3.184 8 7.112v113.776c0 3.928-3.58 7.112-8 7.112h-56c-4.42 0-8-3.184-8-7.112v-113.776c0-3.928 3.58-7.112 8-7.112h56z m-168-216c4.42 0 8 3.184 8 7.112v113.776c0 3.928-3.58 7.112-8 7.112h-56c-4.42 0-8-3.184-8-7.112v-113.776c0-3.928 3.58-7.112 8-7.112h56z m168 0c4.42 0 8 3.184 8 7.112v113.776c0 3.928-3.58 7.112-8 7.112h-56c-4.42 0-8-3.184-8-7.112v-113.776c0-3.928 3.58-7.112 8-7.112h56z" p-id="12655"></path></svg>
    )
  }
)

if (__DEV__) {
  BuildingOutlined.displayName = 'BuildingOutlined'
}
  