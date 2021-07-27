
import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { IconProps } from '../@types/props'

const _role = 'icon-file-pdf-outlined'
const _prefix = getPrefixCls(_role)

export const FilePdfOutlined = forwardRef<SVGSVGElement | null, IconProps>(
  ({ prefixCls = _prefix, role = _role, className, children, style, onClick }, ref) => {
    const cls = cx(prefixCls, className)

    return (
      <svg className={cls} ref={ref} role={role} style={style} onClick={onClick}  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" version="1.1"><path d="M764 304l-132-132v132h132zM552 144H232v736h560V384H560a8 8 0 0 1-8-8V144z m320 160v648a8 8 0 0 1-8 8H160a8 8 0 0 1-8-8V72a8 8 0 0 1 8-8h472l240 240zM331.09 725.032v-60.78h35.894c18.73 0 33.14-4.126 43.232-12.384 10.092-8.256 15.138-22.36 15.138-42.314 0-18.272-5.046-31.766-15.138-40.48-10.09-8.716-23.622-13.074-40.594-13.074H296v169.032h35.09z m32.912-89.906h-32.912v-49.77h32.912c8.334 0 14.812 1.874 19.438 5.62 4.626 3.746 6.938 10.014 6.938 18.806 0 8.792-2.312 15.214-6.938 19.266-4.626 4.052-11.104 6.078-19.438 6.078z m154.37 89.906c25.534 0 44.418-10.512 56.65-31.536 9.02-15.596 13.532-34.632 13.532-57.108 0-8.868-1.07-18.196-3.212-27.98-2.14-9.786-6.154-18.884-12.04-27.294-7.34-10.398-16.934-17.546-28.784-21.444-6.956-2.294-15.672-3.518-26.146-3.67h-72.82v169.032h72.82z m-5.964-29.358h-32.566v-110.318h32.566c16.056 0 26.778 4.608 32.168 13.82 5.39 9.212 8.084 22.42 8.084 39.62 0 12.46-1.796 23.202-5.39 32.224-6.574 16.436-18.194 24.654-34.86 24.654z m131.55 29.358V654.16h74.194v-29.356H643.96v-38.876h84.746v-29.7h-119.836v168.8h35.09z" p-id="11455"></path></svg>
    )
  }
)

if (__DEV__) {
  FilePdfOutlined.displayName = 'FilePdfOutlined'
}
  