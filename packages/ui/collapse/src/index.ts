import './styles/index.scss'

import { Collapse as _Collapse } from './Collapse'
import { CollapsePanel } from './CollapsePanel'

const Collapse: typeof _Collapse & {
  Panel: typeof CollapsePanel
} = _Collapse as any

Collapse.Panel = CollapsePanel

export { Collapse }
export default Collapse

export type { CollapseProps } from './Collapse'
export type { CollapsePanelProps } from './CollapsePanel'
