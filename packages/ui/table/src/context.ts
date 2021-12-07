import { createContext, useContext } from 'react'

import { UseTableReturn } from './use-table'

const TableContext = createContext<Omit<UseTableReturn, 'rootProps'> | null>(null)

export const TableProvider = TableContext.Provider

export const useTableContext = () => {
  const context = useContext(TableContext)

  if (!context) {
    throw new Error('The TableContext context should using in Table.')
  }

  return context
}
