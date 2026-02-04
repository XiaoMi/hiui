import React, { useRef } from 'react'

import { TableContainerContext } from './ctx'
import { useRowVirtualizer } from './hooks'
import { TableColGroup } from './col-group'
import type { VirtualizerOptions } from './type'

type RowVirtualContainerProps = React.PropsWithChildren<{
  options?: VirtualizerOptions
}>

export function RowVirtualContainer(props: RowVirtualContainerProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const { virtualItems: rows, padding: rowPadding } = useRowVirtualizer(props.options)
  const colGroup = <TableColGroup />

  return (
    <TableContainerContext.Provider
      value={{
        headerRef,
        bodyRef,
        footerRef,
        colGroup,
        virtualize: {
          rows,
          rowPadding: {
            top: rowPadding.start,
            bottom: rowPadding.end,
          },
        },
      }}
    >
      {props.children}
    </TableContainerContext.Provider>
  )
}
