import React from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { filterProps } from '@hi-ui/react-utils'

const omitProps = ['tabId', 'tabTitle', 'disabled', 'tabDesc', 'closeable']

export const TabPane: React.FC<TabPaneProps> = ({
  children,
  className,
  style,
  active,
  ...rest
}) => {
  const htmlProps = filterProps(rest, omitProps)
  return (
    <div style={style} className={className} {...htmlProps}>
      {active ? children : null}
    </div>
  )
}

export interface TabPaneProps extends HiBaseHTMLProps<'div'> {
  /**
   * 标签是否禁用
   */
  disabled?: boolean
  /**
   * 每个标签的唯一标识
   */
  tabId: React.ReactText
  /**
   * 选项卡头显示文字
   */
  tabTitle: React.ReactNode
  /**
   * 选项卡头描述文字，仅对 type='desc'时生效
   */
  tabDesc?: React.ReactNode
  /**
   * 标签是否可以关闭，仅对 type='editable'时生效
   */
  closeable?: boolean
  /**
   * 标签是否激活
   */
  active?: boolean
}
