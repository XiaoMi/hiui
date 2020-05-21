import { CSSProperties } from "react"

interface FormProps {
  model?: object
  rules?: object
  labelWidth?: string
  labelPlacement?: 	'right' | 'left' | 'top'
  placement?: 'horizontal' | 'vertical'
  showColon?: boolean
  children: Form.Item
}
interface ItemProps {
  field?: string
  label?: string
  labelWidth?: string
  required?: boolean
  showColon?: boolean
}
declare class Item extends React.Component<ItemProps, any> {
}
declare class Form extends React.Component<FormProps, any> {
  static Item = Item
}
export default Form
