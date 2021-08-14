import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { ExpandTrigger, FlattedCheckCascaderItem } from './types'
import { CheckCascaderMenu } from './CheckCascaderMenu'
import { CheckCascaderProvider } from './context'
import { getActiveMenus } from './utils/index'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const _role = 'check-cascader-menus'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

/**
 * TODO: What is CheckCascaderMenus
 */
export const CheckCascaderMenus = forwardRef<HTMLDivElement | null, CascaderMenusProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data,
      value: valueProp,
      defaultValue = NOOP_ARRAY,
      disabled = false,
      expandTrigger = 'click',
      changeOnSelect = true,
      checkCascaded = false,
      clearable = false,
      emptyContent,
      displayRender,
      onChange,
      onSelect,
      titleRender,
      flatted,
      ...rest
    },
    ref
  ) => {
    const [checkedIds, tryChangeCheckedIds] = useUncontrolledState(
      defaultValue,
      valueProp,
      onChange
    )
    const [selectedIds, setSelectedIds] = useState<React.ReactText[]>([])

    const onOptionSelect = useCallback((option: FlattedCheckCascaderItem) => {
      setSelectedIds((prev) => {
        const nextSelectedIds = prev.slice(0, option.depth)
        nextSelectedIds.push(option.id)
        return nextSelectedIds
      })
    }, [])

    const onOptionCheck = useCallback(
      (option: FlattedCheckCascaderItem, shouldSelected: boolean) => {
        if (!option.checkable) return

        console.log(312)

        let nextCheckedIds = checkedIds

        console.log(option, shouldSelected)

        if (shouldSelected) {
          if (nextCheckedIds.indexOf(option.id) === -1) {
            nextCheckedIds = nextCheckedIds.concat(option.id)
          }
        } else {
          nextCheckedIds = nextCheckedIds.filter((item) => item !== option.id)
        }

        console.log('nextCheckedIds', nextCheckedIds)

        tryChangeCheckedIds(nextCheckedIds)
      },
      [checkedIds, tryChangeCheckedIds]
    )

    const providedValue = useMemo(
      () => ({
        expandTrigger,
        onCheck: onOptionCheck,
        onSelect: onOptionSelect,
        flatted,
        changeOnSelect,
      }),
      [changeOnSelect, expandTrigger, onOptionCheck, onOptionSelect, flatted]
    )

    const menus = flatted ? [data] : getActiveMenus(data, selectedIds)

    const cls = cx(
      prefixCls,
      className,
      flatted && `${prefixCls}--flatted`,
      changeOnSelect && `${prefixCls}--selectchange`
    )

    return (
      <CheckCascaderProvider value={providedValue}>
        <div ref={ref} role={role} className={cls} {...rest}>
          {menus.map((menu, menuIndex) => {
            return (
              <CheckCascaderMenu
                key={menuIndex}
                data={menu}
                selectedIds={selectedIds}
                checkedIds={checkedIds}
                titleRender={titleRender}
              />
            )
          })}
        </div>
      </CheckCascaderProvider>
    )
  }
)

export interface CascaderMenusProps {
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
   * 设置选择项数据源
   */
  data: FlattedCheckCascaderItem[]
  /**
   * 设置当前多选值
   */
  value?: React.ReactText[]
  /**
   * 设置当前多选值默认值
   */
  defaultValue?: React.ReactText[]
  /**
   * 多选值改变时的回调
   */
  onChange?: (values: React.ReactText[]) => void
  /**
   * 选项被点击时的回调
   */
  onSelect?: (selectedIds: React.ReactText[], item: FlattedCheckCascaderItem) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 是否可清空	boolean	true | false	true
   */
  clearable?: boolean
  /**
   * 是否禁止使用	boolean	true | false	false
   */
  disabled?: boolean
  /**
   * 设置选项为空时展示的内容
   */
  emptyContent?: React.ReactNode
  /**
   * 是否启用选择即改变功能
   */
  changeOnSelect?: boolean
  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: FlattedCheckCascaderItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (value: React.ReactText[][]) => React.ReactNode
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
  flatted?: boolean
}

if (__DEV__) {
  CheckCascaderMenus.displayName = 'CheckCascaderMenus'
}
