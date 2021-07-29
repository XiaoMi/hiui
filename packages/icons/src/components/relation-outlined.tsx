
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-relation-outlined'
const _prefix = getPrefixCls(_role)

export const RelationOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M510 68c81.74 0 148 66.26 148 148 0 41.85-17.37 79.642-45.294 106.56l192.91 334.13A149.802 149.802 0 0 1 820 656c81.74 0 148 66.26 148 148s-66.26 148-148 148c-67.876 0-125.08-45.694-142.53-108h-330.94c-17.448 62.306-74.654 108-142.53 108-81.74 0-148-66.26-148-148s66.26-148 148-148c3.808 0 7.582 0.144 11.318 0.426l192.478-333.382C379.578 296.094 362 258.1 362 216c0-81.74 66.26-148 148-148z m310 668c-37.556 0-68 30.444-68 68s30.444 68 68 68 68-30.444 68-68-30.444-68-68-68z m-616 0c-37.556 0-68 30.444-68 68s30.444 68 68 68 68-30.444 68-68-30.444-68-68-68z m306-372c-10.82 0-21.368-1.16-31.528-3.366L291.44 684.58c26.338 19.32 46.05 47.14 55.09 79.42h330.936c8.78-31.354 27.632-58.504 52.842-77.738l-188.088-325.78A148.524 148.524 0 0 1 510 364z m0-216c-37.556 0-68 30.444-68 68s30.444 68 68 68 68-30.444 68-68-30.444-68-68-68z" p-id="13095"></path></svg>
    )
  }
)

if (__DEV__) {
  RelationOutlined.displayName = 'RelationOutlined'
}
  