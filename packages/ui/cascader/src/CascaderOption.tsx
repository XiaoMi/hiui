import React, { forwardRef, useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CascaderItem, ExpandTrigger } from './type'
import { debounce } from './utils'
import { defaultLeafIcon, defaultLoadingIcon, defaultSuffixIcon } from './icons'
import Checkbox from '@hi-ui/checkbox'
import { useCascaderContext } from './context'

const _role = 'cascader-option'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CascaderOption
 */
export const CascaderOption = forwardRef<HTMLDivElement | null, CascaderOptionProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      data: option,
      loading,
      checkable,
      ...rest
    },
    ref
  ) => {
    const { expandTrigger, onLoadChildren, onSelect, value } = useCascaderContext()

    const cls = cx(prefixCls, className)

    return (
      <div ref={ref} role={role} className={cls} {...rest}>
        {renderCheckbox(option, checkable, loading, onLoadChildren)}
        {option.title}
        {renderSuffix(prefixCls, option, loading, onLoadChildren)}
      </div>
    )
  }
)

export interface CascaderOptionProps {
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
  data: CascaderItem
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 该节点是否被单选
   */
  selected?: boolean
  /**
   * 该节点是否被展开
   */
  expanded?: boolean
  /**
   * 表示该节点被复选
   */
  checked?: boolean
  /**
   * 表示该节点被半选
   */
  semiChecked?: boolean
  /**
   * 该节点加载中状态
   */
  loading?: boolean
  /**
   * 该节点被 focus
   */
  focused?: boolean
}

if (__DEV__) {
  CascaderOption.displayName = 'CascaderOption'
}

/**
 * 渲染复选框
 */
const renderCheckbox = (
  node: CascaderItem,
  checkable: boolean,
  disabled?: boolean,
  checked?: boolean,
  semiChecked?: boolean,
  onCheck?: (checkedNode: CascaderItem, checked: boolean) => void
) => {
  return checkable ? (
    <Checkbox
      indeterminate={semiChecked}
      checked={checked}
      disabled={disabled}
      focusable={false}
      onChange={(evt) => {
        onCheck?.(node, evt.target.checked)
      }}
    />
  ) : null
}

/**
 * 渲染菜单子项的展开提示图标
 */
const renderSuffix = (
  prefixCls: string,
  node: CascaderItem,
  loading: boolean,
  onLoadChildren?: (node: CascaderItem) => Promise<any>
) => {
  if (loading) {
    return (
      <span className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--loading`)}>
        {defaultLoadingIcon}
      </span>
    )
  }

  const hasChildren = node.children && node.children.length > 0
  const canLoadChildren = onLoadChildren && !node.children && !node.isLeaf

  if (hasChildren || canLoadChildren) {
    return (
      <span className={cx(`${prefixCls}__switcher`)} style={{ transform: `rotate(-90deg)` }}>
        {defaultSuffixIcon}
      </span>
    )
  }

  return (
    <span className={cx(`${prefixCls}__switcher`, `${prefixCls}__switcher--noop`)}>
      {defaultLeafIcon}
    </span>
  )
}
