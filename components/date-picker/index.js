import DatePicker from './DatePicker'
import { dateFormat } from './dateUtil'
import './style/index'
import Provider from '../context'

DatePicker.format = dateFormat

export default Provider(DatePicker)
