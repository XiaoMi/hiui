import './styles/index.scss'

import { Radio as _Radio } from './Radio'
import { RadioGroup as Group } from './RadioGroup'

const Radio = Object.assign(_Radio, { Group })

export default Radio

export * from './Radio'
export * from './RadioGroup'
