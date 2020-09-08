import Form, { Item as ItemV2 } from './form-legacy/form-v2'
import FormV3 from './Form'
import Item from './Item'
import Submit from './Submit'
import Reset from './Reset'
import List from './List'
import SchemaForm from './SchemaForm'
import useForm from './hooks/useForm'

import Provider from '../context'
import './style/index'

const HiForm = Provider(FormV3)

Form.Item = ItemV2

HiForm.Item = Item
HiForm.Submit = Submit
HiForm.Reset = Reset
HiForm.List = List
HiForm.SchemaForm = SchemaForm
HiForm.useForm = useForm

export default HiForm
export { Form }
