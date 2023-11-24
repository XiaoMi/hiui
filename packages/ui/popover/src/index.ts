import './styles/index.scss'

import { Popover as PurePopover } from './Popover'
import { withModal } from './with-api'

export * from './Popover'

export const Popover = withModal(PurePopover)
export default Popover

export * from './types'
