import LegacyForm, { Item as ItemV2 } from './form-legacy/form-v2'
import FormV3 from './Form'
import Item from './Item'
import Submit from './Submit'
import Reset from './Reset'
import List from './List'
import SchemaForm from './SchemaForm'
import useForm from './hooks/useForm'

import Provider from '../context'
import './style/index'

LegacyForm.Item = ItemV2

const Form = Provider(FormV3)

Form.Item = Item
Form.Submit = Submit
Form.Reset = Reset
Form.List = List
Form.SchemaForm = SchemaForm
Form.useForm = useForm

export default Form
export { LegacyForm }
