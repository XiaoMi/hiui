import Form from './Form'
import Item from './Item'
import Submit from './Submit'
import Reset from './Reset'
import Provider from '../context'
import './style/index'
const FormWrapper = Provider(Form)
FormWrapper.Item = Item
FormWrapper.Submit = Submit
FormWrapper.Reset = Reset

export default FormWrapper
