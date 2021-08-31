import { createContext, useContext } from 'react'

interface TransferContext {
  searchable: boolean
}

const transferContext = createContext<TransferContext | null>(null)

export const TransferProvider = transferContext.Provider

export const useTransferContext = () => {
  const context = useContext(transferContext)

  if (!context) {
    throw new Error('The TransferContext context is not defined.')
  }

  return context
}
