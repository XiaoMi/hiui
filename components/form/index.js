import Form from './Form'
import Item from './Item'
import Submit from './Submit'
import Reset from './Reset'
import SchemaForm from './SchemaForm'
import Provider from '../context'
import './style/index'
const FormWrapper = Provider(Form)
FormWrapper.Item = Item
FormWrapper.Submit = Submit
FormWrapper.Reset = Reset
FormWrapper.SchemaForm = SchemaForm

export default FormWrapper
