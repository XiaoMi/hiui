import { createContext, useContext } from 'react'
import { UseEmbedExpandReturn } from './hooks/use-embed-expand'

import { UseTableReturn } from './use-table'
import { TableRowFunc } from './types'

const TableContext = createContext<
  | (Omit<UseTableReturn, 'rootProps'> &
      UseEmbedExpandReturn & {
        avgRow: Record<string, any>
        hasAvgColumn: boolean
        sumRow: Record<string, any>
        hasSumColumn: boolean
        onRow?: TableRowFunc
        striped: boolean
      })
  | null
>(null)

export const TableProvider = TableContext.Provider

export const useTableContext = () => {
  const context = useContext(TableContext)

  if (!context) {
    throw new Error('The TableContext context should using in Table.')
  }

  return context
}
