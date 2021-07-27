import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CollapseProvider, ICollapseContext } from './context'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const _role = 'collapse'
const _prefix = getPrefixCls(_role)

const EmptyArray = [] as string[]

/**
 * 折叠面板
 */
export const Collapse = forwardRef<HTMLDivElement | null, CollapseProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      style,
      defaultActiveId = EmptyArray,
      activeId,
      accordion,
      onChange,
      arrowPlacement = 'right',
      showArrow = true,
    },
    ref
  ) => {
    const cls = cx(prefixCls, className)

    // 兼容受控与非受控
    const [useActiveIds, tryChange] = useUncontrolledState<string[]>(
      defaultActiveId,
      activeId,
      onChange
    )

    const onClickPanel = useCallback(
      (key: string) => {
        let result = [...useActiveIds]

        // 根据是否为手风琴模式来执行不同数据传递
        if (accordion) {
          result = result[0] === key ? [] : [key]
        } else {
          const searchIndex = result.indexOf(key)

          if (searchIndex >= 0) {
            result.splice(searchIndex, 1)
          } else {
            result.push(key)
          }
        }

        tryChange(result)
      },
      [accordion, tryChange, useActiveIds]
    )

    const provideData = useMemo<ICollapseContext>(
      () => ({
        judgeIsActive: (id) => (accordion ? useActiveIds[0] === id : useActiveIds.includes(id)),
        onClickPanel: onClickPanel,
        arrowPlacement,
        showArrow,
      }),
      [accordion, onClickPanel, useActiveIds, showArrow, arrowPlacement]
    )

    return (
      <CollapseProvider value={provideData}>
        <div ref={ref} role={role} className={cls} style={style}>
          {children}
        </div>
      </CollapseProvider>
    )
  }
)

export interface CollapseProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties

  /**
   * 开启手风琴模式
   * @default false
   */
  accordion?: boolean
  /**
   * 默认展开的面板 id
   */
  defaultActiveId?: string[]
  /**
   * 展开的面板 id
   */
  activeId?: string[]
  /**
   * 箭头所在位置
   */
  arrowPlacement?: 'left' | 'right'
  /**
   * 是否显示展开箭头
   */
  showArrow?: boolean
  /**
   * 切换时的回调
   */
  onChange?: (ids: string[]) => void
  /**
   * 折叠面板
   */
  children?: React.ReactNode
}

if (__DEV__) {
  Collapse.displayName = 'Collapse'
}
