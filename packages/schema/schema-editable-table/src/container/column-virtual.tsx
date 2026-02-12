import React, { useRef } from 'react'

import { TableContainerContext } from './ctx'
import { useColumnVirtualizer } from './hooks'
import { VirtualColGroup } from './col-group'
import type { VirtualizerOptions } from './type'

type ColumnVirtualContainerProps = React.PropsWithChildren<{
  options?: VirtualizerOptions
}>

export function ColumnVirtualContainer(props: ColumnVirtualContainerProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const { virtualItems: columns, padding: colPadding } = useColumnVirtualizer(props.options)

  const colGroup = <VirtualColGroup virtualColumns={columns} virtualColPadding={colPadding} />

  return (
    <TableContainerContext.Provider
      value={{
        headerRef,
        bodyRef,
        footerRef,
        colGroup,
        virtualize: {
          columns,
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
