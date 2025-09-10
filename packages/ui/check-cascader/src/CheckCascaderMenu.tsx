import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import {
  FlattedCheckCascaderDataItem,
  CheckCascaderItemEventData,
  CheckCascaderDataItemRequiredProps,
  CheckCascaderDataItem,
} from './types'
import { defaultLeafIcon, defaultLoadingIcon, defaultSuffixIcon } from './icons'
import Checkbox from '@hi-ui/checkbox'
import { useCheckCascaderContext } from './context'
import { getCascaderItemEventData } from './utils'
import { getNodeAncestorsWithMe } from '@hi-ui/tree-utils'
import VirtualList from '@hi-ui/virtual-list'
import { __DEV__ } from '@hi-ui/env'

const _role = 'check-cascader-menu'
const _prefix = getPrefixCls(_role)

export const CheckCascaderMenu = ({
  prefixCls = _prefix,
  role = _role,
  className,
  style,
  data: menu,
  getCascaderItemRequiredProps,
}: CheckCascaderMenuProps) => {
  const { virtual } = useCheckCascaderContext()

  const isCheckableMenu = menu.some(({ checkable }) => checkable)
  const cls = cx(prefixCls, className, isCheckableMenu && `${prefixCls}--checkable`)

  const virtualListProps = {
    virtual,
    data: menu,
    height: 260,
    itemHeight: 32,
  }

  return (
    <ul className={cls} style={style} role={role}>
      {virtual ? (
        <VirtualList itemKey={'id'} fullHeight={false} {...virtualListProps}>
          {(option: any) => (
            <MenuItem
              key={option.id}
              option={option}
              prefixCls={prefixCls}
              getCascaderItemRequiredProps={getCascaderItemRequiredProps}
            />
          )}
        </VirtualList>
      ) : (
        menu.map((option) => (
          <MenuItem
            key={option.id}
            option={option}
            prefixCls={prefixCls}
            getCascaderItemRequiredProps={getCascaderItemRequiredProps}
          />
        ))
      )}
    </ul>
  )
}

const MenuItem = forwardRef<
  HTMLLIElement,
  {
    option: FlattedCheckCascaderDataItem
    prefixCls?: string
    getCascaderItemRequiredProps: (
      option: FlattedCheckCascaderDataItem
    ) => CheckCascaderDataItemRequiredProps
  }
>(({ option, prefixCls = _prefix, getCascaderItemRequiredProps }, ref) => {
  const {
    flatted = false,
    changeOnSelect = false,
    disabled: disabledContext = false,
    onLoadChildren,
    expandTrigger,
    onCheck,
    onSelect,
    titleRender,
  } = useCheckCascaderContext()

  const renderTitle = useCallback(
    (option: CheckCascaderItemEventData) => {
      // 如果 titleRender 返回 `true`，则使用默认 title
      const title = titleRender ? titleRender(option) : true

      if (title !== true) {
        return title
      }

      return flatted ? (
        <span className={cx(`title__text`, `title__text--cols`)}>
          {getNodeAncestorsWithMe(option)
            .reverse()
            .map((item, index) => {
              return (
                <span className={`title__text--col`} key={item.id}>
                  {item.title}
                </span>
              )
            })}
        </span>
      ) : (
        <span className={`title__text`}>{option.title}</span>
      )
    },
    [titleRender, flatted]
  )

  const eventOption = getCascaderItemEventData(option, getCascaderItemRequiredProps(option))
  const { selected, checked, loading, semiChecked } = eventOption
  const disabled = disabledContext || option.disabled

  const optionCls = cx(
    `${prefixCls}-option`,
    option.checkable && checked && `${prefixCls}-option--checked`,
    // 此处 option.children?.length || !option.checkable 的含义是
    // 如果存在子节点，则可以展现选择态
    // 不存在子节点，如不是可勾选item，则可以展现勾选态
    selected && (option.children?.length || !option.checkable) && `${prefixCls}-option--selected`,
    loading && `${prefixCls}-option--loading`,
    disabled && `${prefixCls}-option--disabled`
  )

  return (
    <li ref={ref} role="menu-item" className={`${prefixCls}-item`} key={option.id}>
      <div
        className={optionCls}
        onClick={(evt) => {
          if (disabled) return

          onSelect?.(eventOption)
          if (changeOnSelect) {
            onCheck?.(eventOption, !checked)
          }
        }}
        onMouseEnter={(evt) => {
          if (expandTrigger === 'hover') {
            onSelect?.(eventOption)
          }
        }}
      >
        {option.checkable ? (
          <Checkbox
            className={`${prefixCls}-checkbox`}
            indeterminate={semiChecked}
            checked={checked}
            disabled={disabled || option.disabledCheckbox || option.disabledCheckboxCascaded}
            onClick={(evt) => evt.stopPropagation()}
            // 当前是半选时，点击将设置为全选，
            // 又因子节点某个选项未选中但是禁用，当前态将一直是半选，那操作将一直是设置全选操作
            onChange={(evt) => {
              onCheck?.(eventOption, !checked)
              onSelect?.(eventOption)
            }}
          />
        ) : null}
        {renderTitle(eventOption)}
        {flatted ? null : renderSuffix(prefixCls, option, loading, onLoadChildren)}
      </div>
    </li>
  )
})

if (__DEV__) {
  MenuItem.displayName = 'MenuItem'
}

export interface CheckCascaderMenuProps {
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
  data: FlattedCheckCascaderDataItem[]
  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: FlattedCheckCascaderDataItem) => React.ReactNode
  /**
   * 获取级联选项必要状态
   */
  getCascaderItemRequiredProps: (
    option: FlattedCheckCascaderDataItem
  ) => CheckCascaderDataItemRequiredProps
}

/**
 * 渲染菜单子项的展开提示图标
 */
const renderSuffix = (
  prefixCls: string,
  node: FlattedCheckCascaderDataItem,
  loading: boolean,
  onLoadChildren?: (
    item: CheckCascaderItemEventData,
    idPaths: React.ReactText[]
  ) => Promise<CheckCascaderDataItem[] | void> | void
) => {
  if (loading) {
    return (
      <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--loading`)}>
        {defaultLoadingIcon}
      </span>
    )
  }

  const hasChildren = node.children && node.children.length > 0
  const canLoadChildren = onLoadChildren && !node.children && !node.isLeaf

  if (hasChildren || canLoadChildren) {
    return (
      <span className={cx(`${prefixCls}-switcher`)} style={{ transform: `rotate(-90deg)` }}>
        {defaultSuffixIcon}
      </span>
    )
  }

  return (
    <span className={cx(`${prefixCls}-switcher`, `${prefixCls}-switcher--noop`)}>
      {defaultLeafIcon}
    </span>
  )
}
