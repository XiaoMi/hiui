import './styles/index.scss'

import { Tooltip as PureTooltip } from './Tooltip'
import { withTooltip } from './with-api'

export type { TooltipProps } from './Tooltip'

export * from './use-tooltip'

export const Tooltip = withTooltip(PureTooltip)
export default Tooltip
