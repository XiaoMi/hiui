import './styles/index.scss'

import { Tabs as _Tabs } from './Tabs'
import { TabPane as Pane } from './TabPane'

const Tabs = Object.assign(_Tabs, { Pane })

export default Tabs

export * from './Tabs'
export * from './TabPane'
export * from './TabList'
