import './styles/index.scss'
import { withStaticWrapper } from './staticWrapper'
import { DatePicker as _DatePicker } from './DatePicker'

const DatePicker = withStaticWrapper(_DatePicker)

export { DatePicker }
export { DatePicker as default }
