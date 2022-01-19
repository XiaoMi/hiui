import './styles/index.scss'

import { Checkbox as _Checkbox } from './Checkbox'
import { CheckboxGroup as Group } from './CheckboxGroup'

export type { CheckboxProps } from './Checkbox'
export * from './CheckboxGroup'

export const Checkbox = Object.assign(_Checkbox, { Group })

export default Checkbox
