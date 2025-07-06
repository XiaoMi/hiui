import React from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { filterProps } from '@hi-ui/react-utils'
import { cx, getPrefixCls } from '@hi-ui/classname'

const _role = 'tabs-tab-pane'
const _prefix = getPrefixCls(_role)
const omitProps = ['tabId', 'tabTitle', 'disabled', 'tabDesc', 'closeable']

export const TabPane: React.FC<TabPaneProps> = ({
  children,
  className,
  style,
  active,
  unmountOnInactive = true,
  preload,
  ...rest
}) => {
  const htmlProps = filterProps(rest, omitProps)
  const [isLoaded, setIsLoaded] = React.useState(false)

  const childrenContentMemo = React.useMemo(() => {
    if (preload && !active && !isLoaded) {
      return children
    }

    if (!unmountOnInactive) {
      if (active && !isLoaded) {
        setIsLoaded(true)
      }

      if (isLoaded) {
        return children
      }
    } else if (active) {
      return children
    }

    return null
  }, [active, children, isLoaded, unmountOnInactive, preload])

  return (
    <div
      style={style}
      className={cx(className, (!active && (preload || !unmountOnInactive)) && `${_prefix}--hide`)}
      {...htmlProps}
    >
      {childrenContentMemo}
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
  /**
   * 标签内容不活跃时是否卸载
   */
  unmountOnInactive?: boolean
  /**
   * 标签内容是否预加载
   * @private
   */
  preload?: boolean
}
