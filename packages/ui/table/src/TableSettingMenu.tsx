import React, { forwardRef, useEffect, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { UseTableProps } from './use-table'
import { SettingOutlined, MenuOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'
import { useToggle } from '@hi-ui/use-toggle'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useLocaleContext } from '@hi-ui/locale-context'
import { runIfFunc } from '@hi-ui/func-utils'
import { useDrag, useDrop } from '@hi-ui/use-drag-sorter'
import { UseColSorterReturn } from './hooks/use-col-sorter'
import { UseColHiddenReturn } from './hooks/use-col-hidden'
import { Drawer } from '@hi-ui/drawer'
import { Button } from '@hi-ui/button'
import { Checkbox } from '@hi-ui/checkbox'

const _prefix = getPrefixCls('table-setting')

/**
 * 表头右侧高级设置菜单（抽屉式）
 */
export const TableSettingMenu = forwardRef<HTMLDivElement | null, TableColumnMenuProps>(
  (
    {
      prefixCls = _prefix,
      sortedCols,
      setSortCols,
      cacheSortedCols,
      setCacheSortedCols,
      hiddenColKeys,
      setHiddenColKeys,
      cacheHiddenColKeys,
      setCacheHiddenColKeys,
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const dropProps = useDrop({
      draggable: true,
      idFieldName: 'dataKey',
      onSwap: async (dragItem, dropItem, direction, info) => {
        setCacheSortedCols((prev: any[]) => {
          const nextCacheSortColKeys = [...prev]
          const [removed] = nextCacheSortColKeys.splice(info.dragIndex, 1)
          nextCacheSortColKeys.splice(info.dropIndex, 0, removed)

          return nextCacheSortColKeys
        })
        return true
      },
    })

    const [menuVisible, menuVisibleAction] = useToggle()

    const resetLatest = useLatestCallback(() => {
      setCacheHiddenColKeys(hiddenColKeys)
      setCacheSortedCols(sortedCols)
    })

    // 当 visible 由 false 变为 true 时触发
    const prevShowPopperRef = useRef(!menuVisible)
    useEffect(() => {
      if (!prevShowPopperRef.current && menuVisible) {
        resetLatest()
      }
      prevShowPopperRef.current = menuVisible
    }, [menuVisible, resetLatest])

    const onConfirm = () => {
      // 触发 table 更新列显隐及排序
      setHiddenColKeys(cacheHiddenColKeys)
      setSortCols(cacheSortedCols)
      menuVisibleAction.off()
    }

    const cls = cx(prefixCls)

    return (
      <div ref={ref} className={cls}>
        <IconButton icon={<SettingOutlined />} onClick={menuVisibleAction.not} />

        <Drawer
          className={`${prefixCls}__drawer`}
          title="字段管理"
          visible={menuVisible}
          onClose={menuVisibleAction.off}
          footer={
            <div className={`${prefixCls}__btn-group`}>
              <Button key={0} className={`${prefixCls}__btn-cancel`} onClick={resetLatest}>
                {i18n.get('table.reset') || '重置'}
              </Button>
              <Button
                key={1}
                className={`${prefixCls}__btn-confirm`}
                onClick={onConfirm}
                type="primary"
              >
                {i18n.get('table.confirm') || '确定'}
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
                />
              )
            })}
          </div>
        </Drawer>
      </div>
    )
  }
)

export interface TableColumnMenuProps
  extends UseTableProps,
    UseColSorterReturn,
    Omit<UseColHiddenReturn, 'visibleCols'> {
  prefixCls?: string
}

if (__DEV__) {
  TableSettingMenu.displayName = 'TableSettingMenu'
}

function TableSettingMenuItem({
  prefixCls,
  column,
  cacheHiddenColKeys,
  setCacheHiddenColKeys,
  dropProps,
  index,
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            checked={!cacheHiddenColKeys.includes(dataKey)}
            onChange={(evt) => {
              const shouldChecked = evt.target.checked
              const nextCacheHiddenColKeys = shouldChecked
                ? cacheHiddenColKeys.filter((col: any) => col !== dataKey)
                : cacheHiddenColKeys.concat(dataKey)

              setCacheHiddenColKeys(nextCacheHiddenColKeys)
            }}
          />
          <span style={{ display: 'inline-block', marginLeft: 9 }}>{runIfFunc(title)}</span>
        </div>
        <MenuOutlined />
      </div>
    </div>
  )
}
