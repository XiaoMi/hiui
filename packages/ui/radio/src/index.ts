import './styles/index.scss'

import { Radio as _Radio } from './Radio'
import { RadioGroup as Group } from './RadioGroup'

export type { RadioProps } from './Radio'
export * from './RadioGroup'

export const Radio = Object.assign(_Radio, { Group })

export default Radio
