import './styles/index.scss'

import { PopConfirm as PurePopConfirm } from './PopConfirm'
import { withPopConfirm } from './with-api'

export * from './PopConfirm'

export const PopConfirm = withPopConfirm(PurePopConfirm)
export default PopConfirm
