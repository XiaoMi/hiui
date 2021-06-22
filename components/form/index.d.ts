import { CSSProperties } from "react"

type formData = {
  [prop: string]: any
}

export interface FormListFieldData {
  field: string
  listItemValue: any
  column: number
  name: string
}
interface FormListOperation {
  add: () => void
  remove: (fieldItem: FormListFieldData) => void
}
interface FormProps {
  initialValues?: formData
  rules?: object
  labelWidth?: string | number
  labelPlacement?: 	'right' | 'left' | 'top'
  placement?: 'horizontal' | 'vertical'
  showColon?: boolean
  children: Form.Item
  style?: CSSProperties
  className?: string
  onValuesChange?: (changedValues: object, allValues: object) => void
}

interface ItemProps {
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
}
interface SchemaItem extends ItemProps {
  component?: string | JSX.Element
  componentProps?: string
}
interface SchemaProps {
  schema?: SchemaItem
  submit?: FormSubmit
  reset?: FormReset
}

interface FormSubmit extends ButtonProps{
  onClick?: (value: object, errors: object) => void
  validate?: any[]
}
interface FormReset extends ButtonProps{
  onClick?: () => void
  fields?: any[]
  toDefault?: boolean
}
interface FormList {
  name?: string
  children?: (fields: FormListFieldData[], operation: FormListOperation) => React.ReactNode
}
declare class Item extends React.Component<ItemProps, any> {
}
declare class SchemaForm extends React.Component<SchemaProps, any> {
}
declare class Form extends React.Component<FormProps, any> {
  static Item = Item
  static SchemaForm = SchemaForm
  static Reset = FormReset
  static Submit = FormSubmit
}

export default Form
