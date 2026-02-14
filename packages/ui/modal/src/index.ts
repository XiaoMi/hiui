import './styles/index.scss'

import { Modal as PureModal } from './Modal'
import { staticApis } from './with-api'
import { useModalContext } from './use-modal-context'

export * from './Modal'
// export { Modal as default } from './Modal'

// export * from './hooks'
export * from './use-modal'
export * from './use-modal-context'

export const Modal = Object.assign(PureModal, {
  ...staticApis,
  useModal: useModalContext,
})

export default Modal

export * from './types'
