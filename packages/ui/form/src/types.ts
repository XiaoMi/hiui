export interface FormState<T> {
  /**
   * 字段及值的映射存储
   */
  values: T
  /**
   * 字段及错误文案的映射存储
   */
  errors: FormErrors<T>
  /**
   * 字段及是否触摸布尔值的映射存储
   */
  touched: FormTouched<T>
  /**
   * 是否正在校验中
   */
  validating: boolean
  /**
   * 是否正在提交中
   */
  submitting?: boolean
}

export type FormTouched<T = any> = Record<string, T>
export type FormErrors<T = any> = Record<string, T>

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
