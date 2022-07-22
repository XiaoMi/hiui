import React, { createContext, useContext } from 'react'

import { UseFormReturn } from './use-form'

export interface FormContextProps extends UseFormReturn {
  labelWidth: React.ReactText
  labelPlacement: 'left' | 'right' | 'top'
  contentPosition: 'top' | 'center' | 'bottom'
  showColon: boolean
  showRequiredOnValidateRequired: boolean
  prefixCls: string
}

const formContext = createContext<Omit<FormContextProps, 'rootProps'> | null>(null)

export const FormProvider = formContext.Provider

export const useFormContext = () => {
  const context = useContext(formContext)

  if (!context) {
    throw new Error('The FormContext should using in Form.')
  }

  return context
}
