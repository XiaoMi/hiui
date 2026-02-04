import React from 'react'
import { useInitialRender } from '../hooks/use-initial-render'
import { NonVirtualContainer } from './base'
import { RowVirtualContainer } from './row-virtual'
import { ColumnVirtualContainer } from './column-virtual'
import { FullVirtualContainer } from './full-virtual'
import { TableHeader, TableBody, TableFooter } from './wrapper'
import { useTableScroll } from './hooks'
import type { VirtualizeOpts } from './type'

export * from './type'

type TableContainerProps = React.PropsWithChildren<{
  virtualize?: VirtualizeOpts
}>

export function TableContainer(props: TableContainerProps) {
  const { virtualize: virtualizeConfig } = props

  useInitialRender() // 初次渲染时容器组件尚未加载，导致白屏，因此在组件挂在后强制更新一次

  useTableScroll() // 滚动时给容器增加类名，用于控制阴影效果

  // 根据配置选择合适的容器
  if (virtualizeConfig?.row && virtualizeConfig?.column) {
    return (
      <FullVirtualContainer
        rowOptions={virtualizeConfig.row}
        columnOptions={virtualizeConfig.column}
      >
        {props.children}
      </FullVirtualContainer>
    )
  }

  if (virtualizeConfig?.row) {
    return (
      <RowVirtualContainer options={virtualizeConfig.row}>{props.children}</RowVirtualContainer>
    )
  }

  if (virtualizeConfig?.column) {
    return (
      <ColumnVirtualContainer options={virtualizeConfig.column}>
        {props.children}
      </ColumnVirtualContainer>
    )
  }

  return <NonVirtualContainer>{props.children}</NonVirtualContainer>
}

// 导出组件
TableContainer.Header = TableHeader
TableContainer.Body = TableBody
TableContainer.Footer = TableFooter

export { useTableContainer } from './ctx'

// 导出类型
export type { TableStickyOpts } from './type'
export type { TableHeaderProps, TableFooterProps } from './wrapper'

// 底部渲染器也在此处导出
export { BottomRender, type BottomRenderConfigType } from './bottom'
