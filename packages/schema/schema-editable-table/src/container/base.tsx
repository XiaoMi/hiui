import React, { useRef } from 'react'

import { TableContainerContext } from './ctx'
import { TableColGroup } from './col-group'

export function NonVirtualContainer(props: React.PropsWithChildren<unknown>) {
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  const colGroup = <TableColGroup />

  return (
    <TableContainerContext.Provider
      value={{
        headerRef,
        bodyRef,
        footerRef,
        colGroup,
      }}
    >
      {props.children}
    </TableContainerContext.Provider>
  )
}
