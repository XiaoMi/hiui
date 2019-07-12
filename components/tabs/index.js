import Tabs from './Tabs'
import TabPane from './TabPane'
import './style/index'

import SwitchVersion from '../_util/SwitchVersion'
import TabsLegacy from './tabs-legacy/index'

const VTabs = SwitchVersion(Tabs, TabsLegacy)
const VTabPane = SwitchVersion(TabPane, TabsLegacy.Pane)

VTabs.Pane = VTabPane

export default VTabs
