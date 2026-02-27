import React, { createContext, MutableRefObject, useContext } from 'react'

import { UseFormReturn } from './use-form'
import { FormFieldPath } from './types'

/** Form 下发给 FormItem 的 label/content 语义化样式，FormItem 可覆盖 */
export interface FormSemanticLabelContent {
  label?: string
  content?: string
}

export interface FormSemanticLabelContentStyles {
  label?: React.CSSProperties
  content?: React.CSSProperties
}

export interface FormContextProps extends UseFormReturn {
  labelWidth: React.ReactText
  labelPlacement: 'left' | 'right' | 'top'
  contentPosition: 'top' | 'center' | 'bottom'
  showColon: boolean
  showRequiredOnValidateRequired: boolean
  showValidateMessage: boolean
  prefixCls: string
  formItemsRef: MutableRefObject<Map<FormFieldPath, HTMLDivElement | null>>
  /** Form 传入的 label/content 语义化 classNames，供 FormItem 默认使用 */
  formSemanticClassNames?: FormSemanticLabelContent
  /** Form 传入的 label/content 语义化 styles，供 FormItem 默认使用 */
  formSemanticStyles?: FormSemanticLabelContentStyles
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
