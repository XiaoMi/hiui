import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { UseTableProps } from './use-table'
import { SettingOutlined, ColumnsOutlined } from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'
import Popper from '@hi-ui/popper'
import { useToggle } from '@hi-ui/use-toggle'
import { useTableContext } from './context'
import { useLatestCallback } from '@hi-ui/use-latest'
import { useLocaleContext } from '@hi-ui/locale-context'
import { Switch } from '@hi-ui/switch'
import { runIfFunc } from '@hi-ui/func-utils'
import { useDrag, useDrop } from '@hi-ui/use-drag-sorter'

const _prefix = getPrefixCls('table-setting')

/**
 * TODO: What is Table
 * 高级定制功能
 */
export const TableSettingMenu = forwardRef<HTMLDivElement | null, TableColumnMenuProps>(
  ({ prefixCls = _prefix, className, ...rest }, ref) => {
    const {
      columns,
      getColKeyValue,
      sortCols,
      setSortCols,
      cacheSortCols,
      setCacheSortCols,
      cacheHiddenColKeys,
      setCacheHiddenColKeys,
      hiddenColKeys,
      setHiddenColKeys,
    } = useTableContext()

    const i18n = useLocaleContext()

    const dropProps = useDrop({
      draggable: true,
      idFieldName: 'dataKey',
      onSwap: async (dragItem, dropItem, direction, info) => {
        setCacheSortCols((prev: any[]) => {
          const nextCacheSortColKeys = [...prev]
          const [removed] = nextCacheSortColKeys.splice(info.dragIndex, 1)
          nextCacheSortColKeys.splice(info.dropIndex, 0, removed)
          console.log(nextCacheSortColKeys, info)

          return nextCacheSortColKeys
        })
        return true
      },
    })

    const [menuVisible, menuVisibleAction] = useToggle()
    const [menuTrigger, setMenuTrigger] = React.useState<HTMLDivElement | null>(null)

    const resetLatest = useLatestCallback(() => {
      setCacheHiddenColKeys(hiddenColKeys)
      setCacheSortCols(sortCols)
    })

    const onConfirm = () => {
      menuVisibleAction.off()
      // 触发 table 更新列显隐及排序
      setHiddenColKeys(cacheHiddenColKeys)
      setSortCols(cacheSortCols)
    }

    const cls = cx(prefixCls, className)

    // TODO：处理 column 模型支持 cellRender，一直出 checkbox、expandIcon 高级选项
    return (
      <div ref={ref} className={cls}>
        <IconButton
          // @ts-ignore
          ref={setMenuTrigger}
          icon={<SettingOutlined />}
          onClick={menuVisibleAction.not}
        />

        <Popper
          className={`${prefixCls}__popper`}
          visible={menuVisible}
          attachEl={menuTrigger}
          // zIndex={1040}
          onClose={menuVisibleAction.off}
        >
          <div className={`${prefixCls}__content`}>
            <div style={{ padding: '16px 20px' }}>
              {cacheSortCols.map((col: any, index: number) => {
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
            <div className={`${prefixCls}__btn-group`}>
              <div className={`${prefixCls}__btn`} onClick={onConfirm}>
                {i18n.get('table.confirm')}
              </div>
              <div className={`${prefixCls}__btn`} onClick={resetLatest}>
                {i18n.get('table.reset')}
              </div>
            </div>
          </div>
        </Popper>
      </div>
    )
  }
)

export interface TableColumnMenuProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onDrop' | 'draggable' | 'onDragStart'>,
    UseTableProps {}

if (__DEV__) {
  TableSettingMenu.displayName = 'TableSettingMenu'
}

const grid = 8

const getItemStyle = (dragging: boolean): React.CSSProperties => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: '#fff',
  border: dragging ? '1px dashed var(--hi-v4-primary, )' : 'none',
})

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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Switch
          checked={!cacheHiddenColKeys.includes(dataKey)}
          onChange={(shouldChecked) => {
            const nextCacheHiddenColKeys = shouldChecked
              ? cacheHiddenColKeys.filter((col) => col !== dataKey)
              : cacheHiddenColKeys.concat(dataKey)

            setCacheHiddenColKeys(nextCacheHiddenColKeys)
          }}
        />
        <span style={{ display: 'inline-block', marginLeft: 9 }}>{runIfFunc(title)}</span>
      </div>
      <ColumnsOutlined />
    </div>
  )
}
