import React, { forwardRef, useCallback, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CollapseProvider, CollapseContext } from './context'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'collapse'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as string[]

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
      defaultActiveId = NOOP_ARRAY,
      activeId,
      accordion = false,
      onChange,
      arrowPlacement = 'right',
      showArrow = true,
      bordered = true,
      arrowRender,
      size = 'md',
      ...rest
    },
    ref
  ) => {
    const cls = cx(
      prefixCls,
      `${prefixCls}--size-${size}`,
      bordered && `${prefixCls}--bordered`,
      className
    )

    // 兼容受控与非受控
    const [useActiveIds, tryChange] = useUncontrolledState(defaultActiveId, activeId, onChange)

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

    const provideData = useMemo(
      () =>
        ({
          judgeIsActive: (id: string) =>
            accordion ? useActiveIds[0] === id : useActiveIds.includes(id),
          onClickPanel: onClickPanel,
          arrowPlacement,
          showArrow,
          arrowRender,
        } as CollapseContext),
      [accordion, onClickPanel, useActiveIds, showArrow, arrowPlacement, arrowRender]
    )

    return (
      <CollapseProvider value={provideData}>
        <div ref={ref} role={role} className={cls} style={style} {...rest}>
          {children}
        </div>
      </CollapseProvider>
    )
  }
)

export type CollapseArrowPlacementEnum = 'left' | 'right'

export interface CollapseProps extends HiBaseHTMLProps<'div'> {
  /**
   * 开启手风琴模式
   */
  accordion?: boolean
  /**
   * 默认展开的面板 id
   */
  defaultActiveId?: React.ReactText[]
  /**
   * 展开的面板 id
   */
  activeId?: React.ReactText[]
  /**
   * 箭头所在位置
   */
  arrowPlacement?: CollapseArrowPlacementEnum
  /**
   * 是否显示展开箭头
   */
  showArrow?: boolean
  /**
   * 切换时的回调
   */
  onChange?: (ids: React.ReactText[]) => void
  /**
   * 折叠面板
   */
  children?: React.ReactNode
  /**
   * 是否开启带边框
   */
  bordered?: boolean
  /**
   * 箭头渲染
   */
  arrowRender?: (active: boolean) => React.ReactNode
  /**
   * 设置头部大小
   */
  size?: 'md' | 'lg'
}

if (__DEV__) {
  Collapse.displayName = 'Collapse'
}
