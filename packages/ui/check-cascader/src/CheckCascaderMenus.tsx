import React, { forwardRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import {
  ExpandTrigger,
  CheckCascaderItemEventData,
  FlattedCheckCascaderItem,
  CheckCascaderItem,
  CheckCascaderItemRequiredProps,
} from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { CheckCascaderMenu } from './CheckCascaderMenu'
import { CheckCascaderProvider } from './context'
import { getActiveMenus, getFlattedMenus, getActiveMenuIds } from './utils'
import { useCheck, useSelect, useAsyncSwitch } from './hooks'

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
      flattedData,
      onChangeData,
      value: valueProp,
      defaultValue = NOOP_ARRAY,
      disabled = false,
      expandTrigger = 'click',
      changeOnSelect = true,
      checkCascaded = false,
      onLoadChildren,
      onChange,
      onSelect,
      titleRender,
      flatted,
      ...rest
    },
    ref
  ) => {
    const [selectedId, onOptionSelect] = useSelect(disabled)
    const selectedIds = getActiveMenuIds(flattedData, selectedId)

    const [isLoadingId, onItemExpand] = useAsyncSwitch(onChangeData, onOptionSelect, onLoadChildren)

    const [onOptionCheck, isCheckedId, isSemiCheckedId] = useCheck(
      checkCascaded,
      disabled,
      flattedData,
      defaultValue,
      valueProp,
      ({ checkedIds, semiCheckedIds }) => {
        onChange?.(checkedIds)
      }
    )

    const getCascaderItemRequiredProps = useLatestCallback(
      ({ id, depth }: FlattedCheckCascaderItem): CheckCascaderItemRequiredProps => {
        return {
          selected: flatted ? selectedId === id : selectedIds[depth] === id,
          checked: isCheckedId(id),
          loading: isLoadingId(id),
          semiChecked: isSemiCheckedId(id),
          focused: false,
        }
      }
    )

    const providedValue = useMemo(
      () => ({
        expandTrigger,
        onCheck: onOptionCheck,
        onSelect: onItemExpand,
        flatted,
        changeOnSelect,
        titleRender,
        onLoadChildren,
        disabled,
      }),
      [
        changeOnSelect,
        expandTrigger,
        onOptionCheck,
        onItemExpand,
        flatted,
        titleRender,
        onLoadChildren,
        disabled,
      ]
    )

    const menus = flatted ? getFlattedMenus(flattedData) : getActiveMenus(flattedData, selectedId)

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
            return menu.length > 0 ? (
              <CheckCascaderMenu
                key={menuIndex}
                data={menu}
                getCascaderItemRequiredProps={getCascaderItemRequiredProps}
              />
            ) : null
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
  data: CheckCascaderItem[]
  /**
   * 更新选择项数据源
   */
  onChangeData: React.Dispatch<React.SetStateAction<CheckCascaderItem[]>>
  /**
   * 设置选择项数据源
   */
  flattedData: FlattedCheckCascaderItem[]
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
  onSelect?: (selectedId: React.ReactText, selectedOption: CheckCascaderItemEventData) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 是否禁止使用
   */
  disabled?: boolean
  /**
   * 是否启用选择即改变功能
   */
  changeOnSelect?: boolean
  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: CheckCascaderItemEventData) => React.ReactNode
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
  /**
   * 将 check 子项拍平展示
   */
  flatted?: boolean

  onLoadChildren?: (item: CheckCascaderItemEventData) => Promise<CheckCascaderItem[] | void> | void
}

if (__DEV__) {
  CheckCascaderMenus.displayName = 'CheckCascaderMenus'
}
