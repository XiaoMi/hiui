import { createContext, useContext } from 'react'

import { UseFormReturn } from './use-form'

const formContext = createContext<Omit<UseFormReturn, 'rootProps'> | null>(null)

export const FormProvider = formContext.Provider

export const useFormContext = () => {
  const context = useContext(formContext)

  if (!context) {
    throw new Error('The FormContext context should using in Form.')
  }

  return context
}
