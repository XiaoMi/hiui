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
import { useDragSorter } from '@hi-ui/use-drag-sorter'

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
      theme,
      localeDatas,
    } = useTableContext()

    const i18n = useLocaleContext()

    const { dragging, dragId, getDragTriggerProps, getDropTriggerProps } = useDragSorter({
      draggable: true,
      idFieldName: 'dataKey',
      dataTransferKey: 'table-setting-data',
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
              {cacheSortCols.map((col, index) => {
                const { dataKey, title } = col
                return (
                  <div
                    key={dataKey}
                    {...getDragTriggerProps({ item: col })}
                    {...getDropTriggerProps({ item: col })}
                    style={Object.assign(
                      {
                        height: 28,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                      getItemStyle(dragging, {})
                    )}
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
                      <span style={{ display: 'inline-block', marginLeft: 9 }}>
                        {runIfFunc(title)}
                      </span>
                    </div>
                    <ColumnsOutlined />
                  </div>
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

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: '#fff',
  border: isDragging ? '1px dashed var(--color-primary)' : 'none',

  // styles we need to apply on draggables
  ...draggableStyle,
})
