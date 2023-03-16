import React, { forwardRef, useEffect, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UseTableProps } from './use-table'
import { MoveOutlined } from '@hi-ui/icons'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useLocaleContext } from '@hi-ui/core'
import { runIfFunc } from '@hi-ui/func-utils'
import { useDrag, useDrop } from '@hi-ui/use-drag-sorter'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useColSorter } from './hooks/use-col-sorter'
import { useColHidden } from './hooks/use-col-hidden'
import { Drawer } from '@hi-ui/drawer'
import { Button } from '@hi-ui/button'
import { Checkbox } from '@hi-ui/checkbox'
import { useColSet } from './hooks/use-col-set'

const _prefix = getPrefixCls('table-setting')

/**
 * 表头右侧高级设置菜单（抽屉式）
 */
export const TableSettingMenuDrawer = forwardRef<HTMLDivElement | null, TableColumnMenuProps>(
  (
    {
      prefixCls = _prefix,
      uniqueId,
      visible: visibleProp,
      onClose,
      columns: columnsProp,
      hiddenColKeys: hiddenColKeysPropBeforeVerify,
      onHiddenColKeysChange,
      sortedColKeys: sortedColKeysPropBeforeVerify,
      onSortedColKeysChange,
      onSetColKeysChange,
      checkDisabledColKeys = [],
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    // ************************ 高级功能 ************************ //
    // ***根据列字段合并sortedColKeysProp,和hiddenColKeys
    const { sortedColKeys: sortedColKeysProp, hiddenColKeys: hiddenColKeysProp } = useColSet({
      columns: columnsProp,
      sortedColKeys: sortedColKeysPropBeforeVerify,
      hiddenColKeys: hiddenColKeysPropBeforeVerify,
    })

    /**
     * 列排序
     */
    const { sortedCols, setSortColKeys, cacheSortedCols, setCacheSortedCols } = useColSorter({
      uniqueId,
      columns: columnsProp,
      sortedColKeys: sortedColKeysProp,
      onSortedColKeysChange,
    })

    /**
     * 列隐藏
     */
    const {
      hiddenColKeys,
      setHiddenColKeys,
      cacheHiddenColKeys,
      setCacheHiddenColKeys,
    } = useColHidden({
      uniqueId,
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
    console.log('visible', visible)
    const resetLatest = useLatestCallback(() => {
      setCacheHiddenColKeys(hiddenColKeys)
      setCacheSortedCols(sortedCols)
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
      // 触发 table 更新列显隐及排序
      setHiddenColKeys(cacheHiddenColKeys)
      const newSortKeys = cacheSortedCols.map((col) => col.dataKey!)
      setSortColKeys(newSortKeys)
      onSetColKeysChange && onSetColKeysChange(newSortKeys, cacheHiddenColKeys)
      setVisible(false)
    }

    return (
      <Drawer
        className={`${prefixCls}__drawer`}
        title={i18n.get('table.fieldExplorer')}
        visible={visible}
        onClose={() => onClose?.()}
        width={304}
        footer={
          <div className={`${prefixCls}__btn-group`}>
            <Button key={0} className={`${prefixCls}__btn-cancel`} onClick={resetLatest}>
              {i18n.get('table.reset')}
            </Button>
            <Button
              key={1}
              className={`${prefixCls}__btn-confirm`}
              onClick={onConfirm}
              type="primary"
            >
              {i18n.get('table.confirm')}
            </Button>
          </div>
        }
      >
        <div className={`${prefixCls}__content`}>
          {cacheSortedCols.map((col: any, index: number) => {
            return (
              <TableSettingMenuItem
                key={col.dataKey}
                prefixCls={prefixCls}
                column={col}
                index={index}
                dropProps={dropProps}
                cacheHiddenColKeys={cacheHiddenColKeys}
                setCacheHiddenColKeys={setCacheHiddenColKeys}
                checkDisabled={checkDisabledColKeys.includes(col.dataKey)}
              />
            )
          })}
        </div>
      </Drawer>
    )
  }
)

export interface TableColumnMenuProps extends UseTableProps {
  prefixCls?: string
  visible?: boolean
  onClose?: () => void
  checkDisabledColKeys?: string[]
  onSetColKeysChange?: (sortedColKeys: string[], hiddenColKeys: string[]) => void
  hiddenColKeys?: string[]
  onHiddenColKeysChange?: (hiddenColKeys: string[]) => void
  sortedColKeys?: string[]
  onSortedColKeysChange?: (sortedColKeys: string[]) => void
}

if (__DEV__) {
  TableSettingMenuDrawer.displayName = 'TableSettingMenuDrawer'
}

function TableSettingMenuItem({
  prefixCls,
  column,
  cacheHiddenColKeys,
  setCacheHiddenColKeys,
  dropProps,
  index,
  checkDisabled,
}: any) {
  const { dataKey, title } = column
  const { dragging, direction, getDragTriggerProps, getDropTriggerProps } = useDrag({
    ...dropProps,
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
          <span>{runIfFunc(title)}</span>
        </Checkbox>
        <MoveOutlined />
      </div>
    </div>
  )
}
