
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-question-outlined'
const _prefix = getPrefixCls(_role)

export const FileQuestionOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M764 304l-132-132v132h132zM552 144H232v736h560V384H560a8 8 0 0 1-8-8V144z m320 160v648a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h472l240 240zM538.88 718v-7.56c0-12.96 2.7-24.84 8.1-35.64 4.86-9.72 11.88-18.9 21.6-26.46 25.92-22.68 41.58-37.26 46.44-42.66 12.96-17.28 19.98-39.42 19.98-66.42 0-32.94-10.8-58.86-32.4-77.76-21.6-19.44-50.22-28.62-85.32-28.62-39.96 0-71.28 11.34-94.5 34.02-23.76 22.68-35.1 54-35.1 93.96h61.56c0-23.22 4.32-41.04 13.5-53.46 10.8-14.58 27.54-21.6 50.76-21.6 18.36 0 32.94 4.86 43.2 15.12 9.72 10.26 15.12 24.3 15.12 42.12 0 13.5-4.86 26.46-14.58 38.34l-6.48 7.56c-35.1 31.32-56.16 54-63.18 68.58-7.56 14.58-10.8 32.4-10.8 52.92V718h62.1z m-31.32 102.308c11.88 0 21.6-3.78 30.24-11.34 7.56-7.56 11.88-17.82 11.88-29.7 0-11.88-4.32-21.6-11.88-29.16-8.1-7.56-18.36-11.34-30.24-11.34-11.88 0-21.6 3.78-29.16 11.34-8.64 7.56-12.42 17.28-12.42 29.16 0 11.88 3.78 21.6 12.42 29.16 7.56 7.56 17.28 11.88 29.16 11.88z" p-id="11405"></path></svg>
    )
  }
)

if (__DEV__) {
  FileQuestionOutlined.displayName = 'FileQuestionOutlined'
}
  