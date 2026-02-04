import React from 'react'
import EmptyState, { EMPTY_STATE_IMAGE_NO_DATA_COLORFUL } from '@hi-ui/empty-state'
import { mergeProps } from '@hi-ui/schema-utils'
import type { EmptyStateProps } from '@hi-ui/empty-state'

export function Empty(props: EmptyStateProps) {
  const nextProps = mergeProps(
    {
      indicator: EMPTY_STATE_IMAGE_NO_DATA_COLORFUL,
      size: 'xl', // 图 120px 宽高
      // 默认高度与父容器同高，垂直居中
      style: { height: '100%', justifyContent: 'center' },
    },
    props
  )

  return <EmptyState {...nextProps} />
}
