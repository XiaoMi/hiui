import React from "react"
import { ButtonProps } from '../button'

type FormData = {
  [prop: string]: any
}

export interface FormListFieldData {
  field?: string
  listItemValue?: any
  column?: number
  name?: string
}
export interface FormListOperation {
  add: () => void
  remove: (fieldItem: FormListFieldData) => void
}
export interface FormProps {
  initialValues?: FormData
  rules?: object
  labelWidth?: string | number
  labelPlacement?: 	'right' | 'left' | 'top'
  placement?: 'horizontal' | 'vertical'
  showColon?: boolean
  children: Form.Item
  style?: React.CSSProperties
  className?: string
  onValuesChange?: (changedValues: object, allValues: object) => void
}

export interface FormItemProps {
  field?: string | string[]
  label?: string | JSX.Element
  name?: string
  row?: number
  rules?: any
  valuePropName?: string
  contentPosition?: 'top' | 'center' |'bottom'
  labelWidth?: string
  required?: boolean
  showColon?: boolean
  style?: React.CSSProperties
  className?: string
}
export interface FormSchemaItem extends FormItemProps {
  component?: string | JSX.Element
  componentProps?: string
}
export interface FormSchemaProps {
  schema?: FormSchemaItem
  submit?: FormSubmit
  reset?: FormReset
}

export interface FormSubmit extends ButtonProps {
  onClick?: (value: object, errors: object) => void
  validate?: any[]
}
export interface FormReset extends ButtonProps {
  onClick?: () => void
  fields?: any[]
  toDefault?: boolean
}
export interface FormList {
  name?: string
  children?: (fields: FormListFieldData[], operation: FormListOperation) => React.ReactNode
}
declare class Item extends React.Component<FormItemProps, any> {
}
declare class SchemaForm extends React.Component<FormSchemaProps, any> {
}
declare class Form extends React.Component<FormProps, any> {
  static Item = Item
  static SchemaForm = SchemaForm
  static List = FormList
  static Reset = FormReset
  static Submit = FormSubmit
}

export default Form
