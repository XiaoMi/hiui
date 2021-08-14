import React, { useCallback } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { FlattedCheckCascaderItem } from './types'
import { defaultLeafIcon, defaultLoadingIcon, defaultSuffixIcon } from './icons'
import Checkbox from '@hi-ui/checkbox'
import { useCheckCascaderContext } from './context'
import { getNodeAncestors } from './utils'

const _role = 'check-cascader-menu'
const _prefix = getPrefixCls(_role)

export const CheckCascaderMenu = ({
  prefixCls = _prefix,
  role = _role,
  className,
  data: menu,
  selectedIds,
  checkedIds,
}: CheckCascaderMenuProps) => {
  const {
    flatted = false,
    changeOnSelect = false,
    disabled,
    onLoadChildren,
    onCheck,
    onSelect,
    titleRender,
  } = useCheckCascaderContext()

  const renderTitle = useCallback(
    (option: FlattedCheckCascaderItem) => {
      // 如果 titleRender 返回 `true`，则使用默认 title
      const title = titleRender ? titleRender(option) : true
      if (title !== true) {
        return title
      }

      console.log('getNodeAncestors', getNodeAncestors(option))

      return flatted ? (
        <span className={cx(`${prefixCls}-title`, `${prefixCls}-title__cols`)}>
          {getNodeAncestors(option)
            .reverse()
            .map((item, index) => {
              return (
                <span className={`${prefixCls}-title__col`} key={item.id}>
                  {item.title}
                </span>
              )
            })}
        </span>
      ) : (
        <span className={`${prefixCls}-title`}>{option.title}</span>
      )
    },
    [titleRender, flatted, prefixCls]
  )

  const isCheckableMenu = menu.some(({ checkable }) => checkable)
  const cls = cx(prefixCls, className, isCheckableMenu && `${prefixCls}--checkable`)

  return (
    <ul className={cls} role={role}>
      {menu.map((option) => {
        const selected = selectedIds.indexOf(option.id) !== -1
        const checked = checkedIds.indexOf(option.id) !== -1
        const loading = false
        console.log(checked)

        const optionCls = cx(
          `${prefixCls}-option`,
          option.checkable && checked && `${prefixCls}-option--checked`,
          selected && `${prefixCls}-option--selected`,
          loading && `${prefixCls}-option--loading`
        )

        return (
          <li role="menu-item" className={`${prefixCls}-item`} key={option.id}>
            <div
              className={optionCls}
              onClick={(evt) => {
                onSelect(option)
                if (changeOnSelect) {
                  onCheck?.(option, !checked, evt)
                }
              }}
            >
              {option.checkable ? (
                <Checkbox
                  className={`${prefixCls}-checkbox`}
                  checked={checked}
                  disabled={disabled}
                  onClick={(evt) => evt.stopPropagation()}
                  onChange={(evt) => {
                    onCheck?.(option, !checked, evt)
                    onSelect(option)
                  }}
                />
              ) : null}
              {renderTitle(option)}
              {renderSuffix(prefixCls, option, loading, onLoadChildren)}
            </div>
          </li>
        )
      })}
    </ul>
  )
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
  data: FlattedCheckCascaderItem[]
  selectedIds: React.ReactText[]
  checkedIds: React.ReactText[]

  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: FlattedCheckCascaderItem) => React.ReactNode
}

/**
 * 渲染菜单子项的展开提示图标
 */
const renderSuffix = (
  prefixCls: string,
  node: FlattedCheckCascaderItem,
  loading: boolean,
  onLoadChildren?: (node: FlattedCheckCascaderItem) => Promise<any>
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
