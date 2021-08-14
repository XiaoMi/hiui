import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CascaderItem, ExpandTrigger, FlattedCascaderItem } from './types'
import { debounce } from './utils'
import { CascaderOption } from './CascaderOption'
import { CascaderProvider } from './context'
import { Checkbox } from '@hi-ui/checkbox'
import { getNodeAncestors } from './utils/index'

const _role = 'cascader-search'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CascaderSearch
 */
export const CascaderSearch = forwardRef<HTMLDivElement | null, CascaderSearchProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      overlayClassName,
      data,
      value,
      onCheck,
      onChange,
      expandTrigger = 'click',
      emptyContent,
      ...rest
    },
    ref
  ) => {
    const [selectedIds, setSelectedIds] = useState<React.ReactText[]>([])

    const onOptionCheck = useCallback(
      (option, index, shouldSelected, evt) => {
        console.log('onOptionSelect', evt, option, index)
        let nextMenuValue = value[index] || []

        if (shouldSelected) {
          if (nextMenuValue.indexOf(option.id) === -1) {
            nextMenuValue = nextMenuValue.concat(option.id)
          }
        } else {
          nextMenuValue = nextMenuValue.filter((item) => item !== option.id)
        }

        const nextValue = [...value]
        nextValue[index] = nextMenuValue

        onChange(nextValue)
        //
        setSelectedIds((prev) => {
          const nextSelectedIds = [...prev]
          nextSelectedIds[index] = option.id
          return nextSelectedIds
        })
      },
      [value, onChange]
    )

    const onOptionSelect = useCallback((option, index, shouldSelected, evt) => {
      console.log('onOptionSelect', evt, option, index)
      setSelectedIds((prev) => {
        const nextSelectedIds = [...prev]
        nextSelectedIds[index] = option.id
        return nextSelectedIds
      })
    }, [])

    const providedValue = useMemo(
      () => ({
        expandTrigger,
        onCheck: onOptionCheck,
        onSelect: onOptionSelect,
      }),
      [expandTrigger, onOptionCheck, onOptionSelect]
    )

    const cls = cx(prefixCls, overlayClassName, className)

    return (
      <CascaderProvider value={providedValue}>
        <ul ref={ref} role={role} className={cls} {...rest}>
          {data.length ? (
            data.map((item, rowIdx) => {
              const nodes = getNodeAncestors(item)

              return (
                <li className={`${prefixCls}__row`} key={rowIdx}>
                  <Checkbox
                    className={`${prefixCls}__row-item`}
                    checked={item.selected}
                    disabled={item.disabled}
                    focusable={false}
                    onChange={(evt) => {
                      onCheck?.(item)
                    }}
                  >
                    <span className={`${prefixCls}__cols`}>
                      {nodes.map((item, index) => {
                        return (
                          <span className={`${prefixCls}__col`} key={item.id}>
                            {item.title}
                          </span>
                        )
                      })}
                    </span>
                  </Checkbox>
                </li>
              )
            })
          ) : (
            <div className={`${prefixCls}__empty`}>{emptyContent}</div>
          )}
        </ul>
      </CascaderProvider>
    )
  }
)

export interface CascaderSearchProps {
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
  overlayClassName?: string
  /**
   * 设置选择项数据源
   */
  data: FlattedCascaderItem[]
  /**
   * 设置当前选中值
   */
  value: React.ReactText[][]
  onSelect?: () => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
}

if (__DEV__) {
  CascaderSearch.displayName = 'CascaderSearch'
}
