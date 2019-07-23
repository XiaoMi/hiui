import Form from './Form'
import Item from './Item'
import Provider from '../context'
import './style/index'
import { depreactedPropsCompat } from '../_util'

Form.Item = depreactedPropsCompat([['field', 'prop']])(Item)

export default Form
