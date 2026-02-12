import React, { useRef } from 'react'

import { TableContainerContext } from './ctx'
import { useRowVirtualizer, useColumnVirtualizer } from './hooks'
import { VirtualColGroup } from './col-group'
import type { VirtualizerOptions } from './type'

type FullVirtualContainerProps = React.PropsWithChildren<{
  rowOptions?: VirtualizerOptions
  columnOptions?: VirtualizerOptions
}>

export function FullVirtualContainer(props: FullVirtualContainerProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const { virtualItems: rows, padding: rowPadding } = useRowVirtualizer(props.rowOptions)
  const { virtualItems: columns, padding: colPadding } = useColumnVirtualizer(props.columnOptions)

  const colGroup = <VirtualColGroup virtualColumns={columns} virtualColPadding={colPadding} />

  return (
    <TableContainerContext.Provider
      value={{
        headerRef,
        bodyRef,
        footerRef,
        colGroup,
        virtualize: {
          rows,
          columns,
          rowPadding: {
            top: rowPadding.start,
            bottom: rowPadding.end,
          },
          colPadding: {
            left: colPadding.start,
            right: colPadding.end,
          },
        },
      }}
    >
      {props.children}
    </TableContainerContext.Provider>
  )
}
