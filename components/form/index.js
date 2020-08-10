import Form from './Form'
import Item from './Item'
import Submit from './Submit'
import Reset from './Reset'
import List from './List'
import SchemaForm from './SchemaForm'
import useForm from './hooks/useForm'
import Provider from '../context'
import './style/index'
const FormWrapper = Provider(Form)
FormWrapper.Item = Item
FormWrapper.Submit = Submit
FormWrapper.Reset = Reset
FormWrapper.List = List
FormWrapper.SchemaForm = SchemaForm
FormWrapper.useForm = useForm

export default FormWrapper
