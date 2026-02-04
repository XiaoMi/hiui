import React, { useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import Input from '@hi-ui/input'
import { DownOutlined } from '@hi-ui/icons'
import { getPrefixStyleVar } from '@hi-ui/classname'
import type { ProFieldRenderEditableCtx } from '../../base'

// 首次渲染时，只有id没有option，需要异步获取选项标题
export const AsyncRefillPlaceholder: React.FC<{
  data: string
  ctx: ProFieldRenderEditableCtx<AnyObject>
  genInitialOptsData: () => Promise<AnyObject[]>
}> = ({ data, ctx, genInitialOptsData }) => {
  const [displayTitle, setDisplayTitle] = useState<string>(data || '')
  const { data: options } = useRequest(genInitialOptsData)

  useEffect(() => {
    const matchedOption = options?.find((item) => String(item.id) === String(data))
    if (matchedOption?.title) {
      setDisplayTitle(matchedOption.title as string)
    }
  }, [data, options])

  return (
    <Input
      value={displayTitle}
      readOnly
      disabled={ctx.field.control?.disabled}
      onDoubleClick={ctx.onActivate}
      onFocus={ctx.onActivate}
      suffix={
        <DownOutlined size={16} color={`var(${getPrefixStyleVar('color-gray-500')}, #929aa6)`} />
      }
    />
  )
}
