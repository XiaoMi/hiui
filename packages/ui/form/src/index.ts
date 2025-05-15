import './styles/index.scss'

import { Form as _Form } from './Form'
import { FormItem as Item } from './FormItem'
import { FormList as List } from './FormList'
import { FormSubmit as Submit } from './FormSubmit'
import { FormReset as Reset } from './FormReset'

const Form = Object.assign(_Form, {
  Item,
  List,
  Submit,
  Reset,
})

export default Form

export * from './Form'
export * from './FormItem'
export * from './FormList'
export * from './FormSubmit'
export * from './FormReset'
export * from './FormLabel'

export * from './types'
