import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { MoveOutlined } from '@hi-ui/icons'
import { useLatestCallback } from '@hi-ui/use-latest'
import { HiBaseHTMLProps, useLocaleContext } from '@hi-ui/core'
import { runIfFunc } from '@hi-ui/func-utils'
import { useDrag, useDrop } from '@hi-ui/use-drag-sorter'
import { isFunction } from '@hi-ui/type-assertion'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { Drawer, DrawerProps } from '@hi-ui/drawer'
import { Button } from '@hi-ui/button'
import { Checkbox } from '@hi-ui/checkbox'
import { useColSet } from './hooks/use-col-set'
import { TableColumnItem } from './types'
import { useColSorter } from './hooks/use-col-sorter'
import { useColHidden } from './hooks/use-col-hidden'

const _prefix = getPrefixCls('setting')

/**
 * 设置抽屉
 */
export const SettingDrawer = forwardRef<HTMLDivElement | null, SettingDrawerProps>(
  (
    {
      prefixCls = _prefix,
      className,
      visible: visibleProp,
      onClose,
      columns: columnsProp = [],
      hiddenColKeys: hiddenColKeysPropBeforeVerify,
      onHiddenColKeysChange,
      sortedColKeys: sortedColKeysPropBeforeVerify,
      onSortedColKeysChange,
      onSetColKeysChange,
      onReset,
      checkDisabledColKeys,
      dragDisabledColKeys,
      extraHeader,
      itemRender,
      drawerProps,
      showCheckAll,
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const [cacheHiddenColKeys, setCacheHiddenColKeys] = useState<string[]>([])

    // 根据列字段合并 sortedColKeys、hiddenColKeys
    const { sortedColKeys: sortedColKeysProp, hiddenColKeys: hiddenColKeysProp } = useColSet({
      columns: columnsProp,
      sortedColKeys: sortedColKeysPropBeforeVerify,
      hiddenColKeys: hiddenColKeysPropBeforeVerify,
    })

    // 列排序
    const { sortedCols, setSortColKeys, cacheSortedCols, setCacheSortedCols } = useColSorter({
      columns: columnsProp,
      sortedColKeys: sortedColKeysProp,
      onSortedColKeysChange,
    })

    // 列隐藏
    const { hiddenColKeys, setHiddenColKeys } = useColHidden({
      // 基于排序的 columns，隐藏的也能排序
      columns: sortedCols,
      hiddenColKeys: hiddenColKeysProp,
      onHiddenColKeysChange,
    })

    const dropProps = useDrop({
      draggable: true,
      idFieldName: 'dataKey',
      onSwap: async (dragItem, dropItem, direction, info) => {
        setCacheSortedCols((prev: any[]) => {
          const nextCacheSortCols = [...prev]
          const [removed] = nextCacheSortCols.splice(info.dragIndex, 1)
          nextCacheSortCols.splice(info.dropIndex, 0, removed)

          return nextCacheSortCols
        })
        return true
      },
    })

    const [visible, setVisible] = useUncontrolledState<boolean>(false, visibleProp, onClose)

    const resetLatest = useLatestCallback(() => {
      setCacheHiddenColKeys(hiddenColKeys)
      setCacheSortedCols(sortedCols)

      onReset?.()
    })

    // 当 visible 由 false 变为 true 时触发
    const prevShowPopperRef = useRef(!visible)
    useEffect(() => {
      if (!prevShowPopperRef.current && visible) {
        resetLatest()
      }
      prevShowPopperRef.current = visible
    }, [visible, resetLatest])

    const onConfirm = () => {
      const newSortKeys = cacheSortedCols.map((col) => col.dataKey!)
      const visibleCols = cacheSortedCols.filter(
        (col) => !cacheHiddenColKeys.includes(col.dataKey!)
      )

      // 触发 table 更新列显隐及排序
      setHiddenColKeys(cacheHiddenColKeys)
      setSortColKeys(newSortKeys)

      onSetColKeysChange?.(newSortKeys, cacheHiddenColKeys, visibleCols)

      setVisible(false)
    }

    const CheckAllContent = (
      <Checkbox
        indeterminate={
          cacheHiddenColKeys.length > 0 && cacheHiddenColKeys.length < columnsProp.length
        }
        checked={cacheHiddenColKeys.length === 0}
        onChange={(e) => {
          const checked = e.target.checked
          if (checked) {
            setCacheHiddenColKeys([])
          } else {
            setCacheHiddenColKeys(
              columnsProp
                .filter(
                  (d1) =>
                    !checkDisabledColKeys?.some((d2) => {
                      return d2 === d1.dataKey
                    })
                )
                .map((d) => d.dataKey ?? '')
            )
          }
        }}
      >
        {i18n.get('checkSelect.checkAll')}
      </Checkbox>
    )

    const cls = cx(`${prefixCls}-drawer`, className)

    return (
      <Drawer
        ref={ref}
        className={cls}
        title={i18n.get('table.fieldExplorer')}
        visible={visible}
        onClose={() => onClose?.()}
        width={304}
        footer={
          <div className={`${prefixCls}-footer`}>
            <div className={`${prefixCls}-footer__extra`}>{showCheckAll && CheckAllContent}</div>
            <div className={`${prefixCls}-footer__action`}>
              <Button onClick={resetLatest}>{i18n.get('table.reset')}</Button>
              <Button onClick={onConfirm} type="primary">
                {i18n.get('table.confirm')}
              </Button>
            </div>
          </div>
        }
        {...drawerProps}
      >
        <div className={`${prefixCls}__content`}>
          {extraHeader}
          {cacheSortedCols.map((col: any, index: number) => {
            return (
              <SettingItem
                key={col.dataKey}
                prefixCls={prefixCls}
                column={col}
                index={index}
                render={itemRender}
                dropProps={dropProps}
                cacheHiddenColKeys={cacheHiddenColKeys}
                setCacheHiddenColKeys={setCacheHiddenColKeys}
                checkDisabled={checkDisabledColKeys?.includes(col.dataKey)}
                dragDisabled={dragDisabledColKeys?.includes(col.dataKey)}
              />
            )
          })}
        </div>
      </Drawer>
    )
  }
)

export interface SettingDrawerProps extends HiBaseHTMLProps<'div'> {
  prefixCls?: string
  /**
   * 是否显示抽屉
   */
  visible?: boolean
  /**
   * 表格列配置
   */
  columns?: TableColumnItem[]
  /**
   * 关闭回调
   */
  onClose?: () => void
  /**
   * 禁止选择的列
   */
  checkDisabledColKeys?: string[]
  /**
   * 禁止拖拽的列
   */
  dragDisabledColKeys?: string[]
  /**
   * 确认设置回调
   */
  onSetColKeysChange?: (
    sortedColKeys: string[],
    hiddenColKeys: string[],
    visibleCols: TableColumnItem[]
  ) => void
  /**
   * 重置按钮点击时回调
   */
  onReset?: () => void
  /**
   * 隐藏列
   */
  hiddenColKeys?: string[]
  /**
   * 列隐藏回调
   */
  onHiddenColKeysChange?: (hiddenColKeys: string[]) => void
  /**
   * 排序列
   */
  sortedColKeys?: string[]
  /**
   * 列排序回调
   */
  onSortedColKeysChange?: (sortedColKeys: string[]) => void
  /**
   * 自定义扩展头部内容
   */
  extraHeader?: React.ReactNode
  /**
   * 自定义字段渲染
   */
  itemRender?: (item: TableColumnItem) => React.ReactNode
  /**
   * Drawer 组件配置
   */
  drawerProps?: Omit<DrawerProps, 'className'>
  /**
   * 显示全选
   */
  showCheckAll?: boolean
}

if (__DEV__) {
  SettingDrawer.displayName = 'SettingDrawer'
}

function SettingItem({
  prefixCls,
  column,
  cacheHiddenColKeys,
  setCacheHiddenColKeys,
  dropProps,
  index,
  checkDisabled,
  dragDisabled,
  render,
}: any) {
  const { dataKey, title } = column

  const { dragging, direction, getDragTriggerProps, getDropTriggerProps } = useDrag({
    ...dropProps,
    draggable: !dragDisabled,
    item: column,
    index,
    idFieldName: 'dataKey',
    dataTransferKey: 'table-setting-data',
  })

  return (
    <div
      className={cx(
        `${prefixCls}-item`,
        dragging && `${prefixCls}-item--dragging`,
        dragDisabled && `${prefixCls}-item--drag-disabled`,
        direction && `${prefixCls}-item--direction-${direction}`
      )}
      {...getDragTriggerProps()}
      {...getDropTriggerProps()}
    >
      <div className={`${prefixCls}-item__wrap`}>
        <Checkbox
          disabled={checkDisabled}
          checked={!cacheHiddenColKeys.includes(dataKey)}
          onChange={(evt) => {
            const shouldChecked = evt.target.checked
            const nextCacheHiddenColKeys = shouldChecked
              ? cacheHiddenColKeys.filter((col: any) => col !== dataKey)
              : cacheHiddenColKeys.concat(dataKey)

            setCacheHiddenColKeys(nextCacheHiddenColKeys)
          }}
        >
          <span>{isFunction(render) ? render(column) : runIfFunc(title)}</span>
        </Checkbox>
        {!dragDisabled && <MoveOutlined />}
      </div>
    </div>
  )
}
