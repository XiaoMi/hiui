import React, { createContext, useContext } from 'react'

interface CheckboxGroupContext {
  onChange?: (val: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  value?: React.ReactText[]
}

const checkboxGroupContext = createContext<CheckboxGroupContext>({})

export const CheckboxGroupProvider = checkboxGroupContext.Provider

export const useCheckboxGroupContext = () => {
  const context = useContext(checkboxGroupContext)

  if (!context) {
    throw new Error('The CheckboxGroupContext context is not defined.')
  }

  return context
}
