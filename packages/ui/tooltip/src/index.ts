import './styles/index.scss'

import { Tooltip as PureTooltip } from './Tooltip'
import { withTooltip } from './with-api'

export * from './Tooltip'
// export { Tooltip as default } from './Tooltip'

export * from './use-tooltip'

export const Tooltip = withTooltip(PureTooltip)
export default Tooltip
