import Form from './Form'
import Item from './Item'
import Provider from '../context'
import './style/index'
const FormWrapper = Provider(Form)
console.log('FormWrapper', FormWrapper)
FormWrapper.Item = Item

export default FormWrapper
