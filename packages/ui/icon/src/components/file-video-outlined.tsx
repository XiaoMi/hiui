
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-video-outlined'
const _prefix = getPrefixCls(_role)

export const FileVideoOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M764 304l-132-132v132h132zM552 144H232v736h560V384H560a8 8 0 0 1-8-8V144z m320 160v648a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h472l240 240zM602.414 512c1.612 0 2.92 1.31 2.92 2.928l-0.002 55.432 66.37-29.304a5.918 5.918 0 0 1 7.788 2.964c0.336 0.748 0.51 1.56 0.51 2.38v192.534c0 0.82-0.174 1.63-0.51 2.38a5.918 5.918 0 0 1-7.612 3.038l-0.176-0.074-66.37-29.306v53.238c0 1.616-1.306 2.928-2.92 2.928H346.92c-1.612 0-2.92-1.312-2.92-2.928v-253.28c0-1.62 1.308-2.93 2.92-2.93h255.494z" p-id="11445"></path></svg>
    )
  }
)

if (__DEV__) {
  FileVideoOutlined.displayName = 'FileVideoOutlined'
}
  