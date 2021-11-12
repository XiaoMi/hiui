import React from 'react'

const TabPane: React.FC<TabPaneProps> = ({ children, className, style }) => {
  return (
    <div style={style} className={className}>
      {children}
    </div>
  )
}

export default TabPane

export interface TabPaneProps {
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
  tabId: string
  tabTitle: React.ReactNode
  closeable?: boolean
}
