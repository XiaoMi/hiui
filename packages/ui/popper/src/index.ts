import './styles/index.scss'

import type { PopperPortalProps } from './PopperPortal'

export * from './Popper'
export { Popper as default } from './Popper'

export * from './use-popper'

export * from './PopperPortal'

export type PopperOverlayProps = Pick<
  PopperPortalProps,
  'matchWidth' | 'className' | 'placement' | 'container' | 'disabledPortal'
>
