import React, { forwardRef, useEffect, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import {
  CheckCascaderExpandTriggerEnum,
  CheckCascaderItemEventData,
  FlattedCheckCascaderDataItem,
  CheckCascaderDataItem,
  CheckCascaderDataItemRequiredProps,
} from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { CheckCascaderMenu } from './CheckCascaderMenu'
import { CheckCascaderProvider } from './context'
import { getActiveMenus, getFlattedMenus, getActiveMenuIds, getFilteredMenuList } from './utils'
import { useCheck, useSelect, useAsyncSwitch } from './hooks'
import { isFunction } from '@hi-ui/type-assertion'

const _role = 'check-cascader-menus'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

export const CheckCascaderMenuList = forwardRef<HTMLDivElement | null, CascaderMenusProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data,
      flattedData,
      originalFlattedData,
      onChangeData,
      value: valueProp,
      defaultValue = NOOP_ARRAY,
      disabled = false,
      expandTrigger = 'click',
      changeOnSelect = false,
      checkCascaded = true,
      onLoadChildren,
      onChange,
      onSelect,
      titleRender,
      dropdownColumnRender,
      flatted,
      checkedMode = 'ALL',
      virtual,
      onMenuListChange,
      ...rest
    },
    ref
  ) => {
    if (checkCascaded === false) {
      checkedMode = 'SEPARATE'
    }

    const [selectedId, onOptionSelect] = useSelect(disabled)
    const selectedIds = getActiveMenuIds(flattedData, selectedId)

    const [isLoadingId, onItemExpand] = useAsyncSwitch(onChangeData, onOptionSelect, onLoadChildren)

    const [onOptionCheck, isCheckedId, isSemiCheckedId] = useCheck(
      checkedMode,
      disabled,
      originalFlattedData,
      defaultValue,
      valueProp,
      ({ checkedIds, semiCheckedIds }, target, shouldChecked) => {
        // @ts-ignore
        onChange?.(checkedIds, target, shouldChecked)
      }
    )

    const getCascaderItemRequiredProps = useLatestCallback(
      ({ id, depth }: FlattedCheckCascaderDataItem): CheckCascaderDataItemRequiredProps => {
        return {
          selected: flatted ? selectedId === id : selectedIds[depth] === id,
          checked: isCheckedId(id),
          loading: isLoadingId(id),
          semiChecked: isSemiCheckedId(id),
          // focused: false,
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
        virtual,
      }),
      [
        expandTrigger,
        onOptionCheck,
        onItemExpand,
        flatted,
        changeOnSelect,
        titleRender,
        onLoadChildren,
        disabled,
        virtual,
      ]
    )

    const filteredMenus = useMemo(() => {
      const menus = flatted
        ? getFlattedMenus(originalFlattedData)
        : getActiveMenus(originalFlattedData, selectedId)
      return getFilteredMenuList(menus, flattedData)
    }, [flatted, flattedData, originalFlattedData, selectedId])

    useEffect(() => {
      onMenuListChange?.(filteredMenus)
    }, [filteredMenus, onMenuListChange])

    const cls = cx(
      prefixCls,
      className,
      flatted && `${prefixCls}--flatted`,
      changeOnSelect && `${prefixCls}--selectchange`
    )

    return (
      <CheckCascaderProvider value={providedValue}>
        <div ref={ref} role={role} className={cls} {...rest}>
          {filteredMenus.map((menu, menuIndex) => {
            const menuContent = (
              <CheckCascaderMenu
                key={menuIndex}
                data={menu}
                getCascaderItemRequiredProps={getCascaderItemRequiredProps}
              />
            )
            return menu.length > 0
              ? isFunction(dropdownColumnRender)
                ? dropdownColumnRender(menuContent, menuIndex)
                : menuContent
              : null
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
  data: CheckCascaderDataItem[]
  /**
   * 更新选择项数据源
   */
  onChangeData: React.Dispatch<React.SetStateAction<CheckCascaderDataItem[]>>
  /**
   * 设置选择项数据源
   */
  flattedData: FlattedCheckCascaderDataItem[]
  /**
   * 未被过滤的选择项数据源，Hotfix：https://github.com/XiaoMi/hiui/issues/2992
   * @private
   */
  originalFlattedData: FlattedCheckCascaderDataItem[]
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
  expandTrigger?: CheckCascaderExpandTriggerEnum
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
   * 自定义下拉菜单每列渲染
   */
  dropdownColumnRender?: (menu: React.ReactElement, level: number) => React.ReactNode
  /**
   * 多选数据交互时回填、回显模式
   * PARENT: 当所有子节点被选中时将只保留父节点
   * ALL: 所有被选中节点，不区分父子节点（不支持异步数据加载勾选checkbox）
   * CHILD: 仅显示子节点（不支持异步数据加载勾选checkbox）
   * SEPARATE：父子完全独立受控
   */
  checkedMode?: 'PARENT' | 'CHILD' | 'ALL' | 'SEPARATE'
  /**
   * 支持 checkbox 级联（正反选）功能
   */
  checkCascaded?: boolean
  /**
   * 将 check 子项拍平展示
   */
  flatted?: boolean
  /**
   * 点击异步加载子项
   */
  onLoadChildren?: (
    item: CheckCascaderItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CheckCascaderDataItem[] | void> | void
  /**
   * 是否开启虚拟滚动
   */
  virtual?: boolean
  /**
   * 菜单列表改变时的回调
   */
  onMenuListChange?: (menuList: FlattedCheckCascaderDataItem[][]) => void
}

if (__DEV__) {
  CheckCascaderMenuList.displayName = 'CheckCascaderMenuList'
}
