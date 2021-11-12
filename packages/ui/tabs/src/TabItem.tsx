import React, { useRef } from 'react'
import { getPrefixCls } from '@hi-ui/classname'
import { TabPaneProps } from './TabPane'
const _role = 'tab-item'
const _prefix = getPrefixCls(_role)

interface TabItemProps extends TabPaneProps {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void
  active: boolean
  onTabClick: (key: string) => void
}

const TabItem: React.FC<TabItemProps> = ({
  className,
  style,
  disabled,
  tabTitle,
  tabId,
  onClick,
}) => {
  const itemRef = useRef<HTMLDivElement>(null)
  return (
    <div
      style={style}
      className={className}
      ref={itemRef}
      tabIndex={disabled ? 0 : -1}
      onClick={onClick}
    >
      <span>{tabTitle}</span>
    </div>
  )
}

export default TabItem
