import './styles/index.scss'

import { Popover as PurePopover } from './Popover'
import { withPopover } from './with-api'

export * from './Popover'

export const Popover = withPopover(PurePopover)
export default Popover

export * from './types'
