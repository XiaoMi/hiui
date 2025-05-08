import { createContext, SyntheticEvent, useContext } from 'react'
import { UseEmbedExpandReturn } from './hooks/use-embed-expand'

import { UseTableReturn } from './use-table'
import { TableOnRowReturn } from './types'
import { ResizeCallbackData } from 'react-resizable'

type TableContextType = Omit<UseTableReturn, 'rootProps'> &
  UseEmbedExpandReturn & {
    avgRow: Record<string, any>
    hasAvgColumn: boolean
    sumRow: Record<string, any>
    hasSumColumn: boolean
    onRow?: (rowData: Record<string, any> | null, index: number) => TableOnRowReturn
    striped: boolean
    virtual?:
      | boolean
      | {
          onVisibleChange?: (
            visibleList: any[],
            fullList: any[],
            virtualInfo?: {
              start: number
              end: number
              scrollTop: number
              heights: number[]
            }
          ) => void
        }
    onResizeStop?: (
      evt: SyntheticEvent,
      size: ResizeCallbackData['size'],
      index: number,
      columnsWidth: number[]
    ) => void
  }

const TableContext = createContext<TableContextType | null>(null)

export const TableProvider = TableContext.Provider

export const useTableContext = (): TableContextType => {
  const context = useContext(TableContext)

  if (!context) {
    throw new Error('The TableContext context should using in Table.')
  }

  return context
}
