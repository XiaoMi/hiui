import Form from './Form'
import Item from './Item'
import Provider from '../context'
import './style/index'
const FormWrapper = Provider(Form)
FormWrapper.Item = Item

export default FormWrapper
