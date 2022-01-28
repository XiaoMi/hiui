import './styles/index.scss'

import { Checkbox as _Checkbox } from './Checkbox'
import { CheckboxGroup as Group } from './CheckboxGroup'

const Checkbox = Object.assign(_Checkbox, { Group })

export default Checkbox

export * from './Checkbox'
export * from './CheckboxGroup'
