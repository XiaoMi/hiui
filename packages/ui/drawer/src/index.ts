import './styles/index.scss'

import { Drawer as PureDrawer } from './Drawer'
import { staticApis } from './with-api'
import { useDrawerContext } from './use-drawer-context'

export * from './Drawer'
export * from './use-drawer-context'
export { useDrawerContext as useDrawer } from './use-drawer-context'

export const Drawer = Object.assign(PureDrawer, {
  ...staticApis,
  useDrawer: useDrawerContext,
})
export { Drawer as default }
