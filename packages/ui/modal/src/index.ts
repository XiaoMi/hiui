import './styles/index.scss'

import { Modal as PureModal } from './Modal'
import { withModal } from './with-api'

export * from './Modal'
// export { Modal as default } from './Modal'

// export * from './hooks'
export * from './use-modal'

export const Modal = withModal(PureModal)
export default Modal

export * from './types'
