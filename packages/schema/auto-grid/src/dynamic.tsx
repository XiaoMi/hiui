import React from 'react'
import { useColumnCount, type UseColumnCountCtxType } from './use-count'
import type { GridHelperProps } from './index'

type DynamicColumnCountInjectorProps = UseColumnCountCtxType & {
  children: React.ReactElement<GridHelperProps>
}

export type DynamicGridHelperProps = GridHelperProps & UseColumnCountCtxType

export function DynamicColumnCountInjector(props: DynamicColumnCountInjectorProps) {
  // 计算实际可视列数
  const columnCount = useColumnCount(props)
  return React.cloneElement(props.children, { columnCount })
}

export function extractGridProps(props?: DynamicGridHelperProps) {
  const {
    columnCount,
    dftColumnCount,
    wrapperElRef,
    onColumnCountChange,
    breakpoints,
    layoutShiftSensitive,
    ...restGridProps
  } = props || {}

  const injectorProps: UseColumnCountCtxType = {
    columnCount,
    dftColumnCount,
    wrapperElRef,
    onColumnCountChange,
    breakpoints,
    layoutShiftSensitive,
  }

  return { injectorProps, gridProps: restGridProps as GridHelperProps }
}
