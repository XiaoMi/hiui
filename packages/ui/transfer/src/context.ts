import { createContext, useContext } from 'react'

interface TransferContext {
  selectable?: boolean
}

const transferContext = createContext<TransferContext>({})

export const TransferProvider = transferContext.Provider

export const useTransferContext = () => {
  const context = useContext(transferContext)

  if (!context) {
    throw new Error('The TransferContext context is not defined.')
  }

  return context
}
