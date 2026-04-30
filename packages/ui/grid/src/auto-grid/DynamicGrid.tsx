import React, { forwardRef, useRef } from 'react'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useColumnCount } from './use-column-count'
import type { UseColumnCountCtxType } from './use-column-count'
import { AutoGrid } from './AutoGrid'
import type { AutoGridProps } from './AutoGrid'
import { __DEV__ } from '@hi-ui/env'

export type DynamicGridProps = AutoGridProps & UseColumnCountCtxType

export const DynamicGrid = forwardRef<HTMLDivElement | null, DynamicGridProps>(function DynamicGrid(
  props,
  ref
) {
  const {
    columnCount: columnCountProp,
    defaultColumnCount,
    wrapperElRef: wrapperElRefProp,
    onColumnCountChange,
    breakpoints,
    sensitive,
    ...autoGridProps
  } = props

  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const wrapperElRef = wrapperElRefProp ?? wrapperRef

  const columnCount = useColumnCount({
    columnCount: columnCountProp,
    defaultColumnCount,
    wrapperElRef: columnCountProp == null ? wrapperElRef : undefined,
    onColumnCountChange,
    breakpoints,
    sensitive,
  })

  const mergedRef = useMergeRefs(wrapperElRefProp ?? wrapperRef, ref)

  return (
    <div ref={mergedRef} style={{ width: '100%' }}>
      <AutoGrid {...autoGridProps} columnCount={columnCount} />
    </div>
  )
})

if (__DEV__) {
  DynamicGrid.displayName = 'DynamicGrid'
}
