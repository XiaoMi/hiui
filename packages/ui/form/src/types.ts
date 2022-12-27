import { RuleItem } from 'async-validator'

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

export type FormSetState<T> =
  | Partial<FormState<T>>
  | ((state: FormState<T>) => Partial<FormState<T>>)

export type FormAction<T> =
  | { type: 'SUBMIT_ATTEMPT' }
  | { type: 'SUBMIT_DONE' }
  | { type: 'SET_VALIDATING'; payload: boolean }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_VALUES'; payload: T }
  | { type: 'SET_FIELD_VALUE'; payload: { field: FormFieldPath; value?: any } }
  | { type: 'SET_FIELD_TOUCHED'; payload: { field: FormFieldPath; value?: boolean } }
  | { type: 'SET_FIELD_ERROR'; payload: { field: FormFieldPath; value?: string } }
  | { type: 'SET_TOUCHED'; payload: FormTouched<T> }
  | { type: 'SET_ERRORS'; payload: FormErrors<T> }
  | { type: 'SET_STATUS'; payload: any }
  | { type: 'SET_FORM'; payload: FormState<T> }
  | { type: 'SET_STATE'; payload: FormSetState<T> }

export type FormValidateFunction<T = any> = (value: T) => string | Promise<string> | undefined

export interface FormFieldCollection<T> {
  validate: (value: any) => Promise<T>
}

// export interface FormRuleModel<T = any> {
//   trigger?: 'onChange' | 'onBlur' | 'none'
//   name?: string
//   strategy?: T
//   validator?: FormValidateFunction
//   message?: string
//   transform?: (v: T) => any
// }

export interface FormRuleModel extends RuleItem, Record<string, any> {}

export type FormRuleType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'any'

// export type FormRuleName = 'required' | 'email'

export interface FormHelpers<T = any> {
  /**
   * 对整个表单进行校验, 对应 Form.Submit中的 API
   */
  validate: () => Promise<T>
  /**
   * 重置整个表单的验证,对应 Form.Reset中的 API，如果不知道 nextState，则重置为 initialValues
   */
  reset: (nextState?: Partial<FormState<any>>) => Promise<T>
  /**
   * 对指定表单字段进行校验
   */
  validateField: (fields: FormFieldPath) => Promise<T>
  /**
   * 设置某个表单字段的值，在更新表单数据的的时候，使用该方法
   */
  setFieldValue: (field: FormFieldPath, value: any) => void
  /**
   * 设置多个表单的值，在异步获取的数据回显的时候，使用该方法
   * TODO
   */
  setFieldsValue: (
    field: Record<string, any> | ((prevValues: Record<string, any>) => Record<string, any>)
  ) => void
  /**
   * 	获取一个字段名对应的 Value，返回为对应 Field 值
   */
  getFieldValue: (field: FormFieldPath) => any
  /**
   * 	获取所有字段名对应的 Values 返回为字典映射数据结构
   */
  getFieldsValue: () => any
  /**
   * 获取一组字段名对应的 errorMessage，返回为对应 field 错误信息
   */
  getFieldError: (field: FormFieldPath) => any
  /**
   * 获取所有字段名对应的错误信息，返回为字典映射数据结构
   */
  getFieldsError: () => FormErrors<any>
  /**
   * 移除所有表单项的校验结果
   */
  clearValidates: () => void
  /**
   *  移除表单项的校验结果，传入待移除的表单项的 field 属性组成的数组
   */
  clearFieldValidate: (fields: FormFieldPath) => void
}

export interface FormListHelper {
  /**
   * 动态添加表单
   */
  add: (value: any) => void
  /**
   * 动态删除表单
   */
  remove: (index: number) => void
  /**
   * 在 index 之前插入
   */
  insertBefore: (index: number, value: any) => void
  /**
   * 置换表单值
   */
  swap: (aIndex: number, bIndex: number) => void
  /**
   * 移动表单值
   */
  move: (fromIndex: number, toIndex: number) => void
}

export type FormFieldPath = (string | number)[] | string | number

export type FormErrorMessage = string

export type FormRules = Record<string, FormRuleModel[]>

export interface FormListChildrenAction {
  /**
   * 在尾部追加一个 FormItems
   */
  add: (value: any) => void
  /**
   * 移除指定下标的 FormItems
   */
  remove: (index: number) => void
  /**
   * 交换指定下标的 FormItems
   */
  swap: (aIndex: number, bIndex: number) => void
  /**
   * 在指定下标前插入 FormItems
   */
  insertBefore: (index: number, value: any) => void
  /**
   * 移动指定下标的 FormItems 到另一个下标位置
   */
  move: (fromIndex: number, toIndex: number) => void
}
