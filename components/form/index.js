import Form from './Form'
import Item from './Item'
import Submit from './Submit'
import Provider from '../context'
import './style/index'
const FormWrapper = Provider(Form)
FormWrapper.Item = Item
FormWrapper.Submit = Submit

export default FormWrapper
