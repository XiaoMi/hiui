import React from 'react'
import Tabs from './Tabs'
import TabPane from './TabPane'
import './style/index'

import TabsLegacy from './tabs-legacy/index'

const VTabs = ({ legacy, ...props }) => {
  const WrapperComponent = legacy ? TabsLegacy : Tabs
  return <WrapperComponent {...props} />
}
const VTabPane = ({ legacy, ...props }) => {
  const WrapperComponent = legacy ? TabsLegacy.Pane : TabPane
  return <WrapperComponent {...props} />
}

VTabs.Pane = VTabPane

export default VTabs
