import React from 'react'

export interface FormState<T> {
  /** Form values */
  values: T
  /** map of field names to specific error for that field */
  errors: FormErrors<T>
  /** map of field names to whether the field has been touched */
  touched: FormTouched<T>
  /** whether the form is currently validating (prior to submission) */
  isValidating: boolean
}

export interface FormTouched<T> {}
export interface FormErrors<T> {}

export type FormAction<T> =
  | { type: 'SUBMIT_ATTEMPT' }
  | { type: 'SUBMIT_DONE' }
  | { type: 'SET_VALIDATING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_VALUES'; payload: T }
  | { type: 'SET_FIELD_VALUE'; payload: { field: string; value?: any } }
  | { type: 'SET_FIELD_TOUCHED'; payload: { field: string; value?: boolean } }
  | { type: 'SET_FIELD_ERROR'; payload: { field: string; value?: string } }
  | { type: 'SET_TOUCHED'; payload: FormTouched<T> }
  | { type: 'SET_ERRORS'; payload: FormErrors<T> }
  | { type: 'SET_STATUS'; payload: any }
  | { type: 'SET_FORM'; payload: FormState<T> }

export interface FormFieldCollection {
  validate: (value: any) => string | Promise<string> | undefined
}
