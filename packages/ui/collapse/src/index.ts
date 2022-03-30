import './styles/index.scss'

import { Collapse as _Collapse } from './Collapse'
import { CollapsePanel as Panel } from './CollapsePanel'

const Collapse = Object.assign(_Collapse, { Panel })

export default Collapse

export * from './Collapse'
export * from './CollapsePanel'
