import React, { forwardRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { UseTableProps } from './use-table'
import {
  LockOutlined,
  DownOutlined,
  ColumnHeightOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from '@hi-ui/icons'
import { IconButton } from '@hi-ui/icon-button'
import Popper from '@hi-ui/popper'
import { useToggle } from '@hi-ui/use-toggle'
import { useTableContext } from './context'

const _role = 'TableColumnMenu'
const _prefix = getPrefixCls('table')

/**
 * TODO: What is Table
 */
export const TableColumnMenu = forwardRef<HTMLDivElement | null, TableColumnMenuProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      striped = false,
      loading = false,
      standard = false,
      canSort = false,
      columnKey,
      ...rest
    },
    ref
  ) => {
    const {
      activeSorterType,
      activeSorterColumn,
      setActiveSorterType,
      setActiveSorterColumn,
      highlightColumns,
      setHighlightColumns,
      freezeColumn,
      setFreezeColumn,
    } = useTableContext()

    const [menuVisible, menuVisibleAction] = useToggle()
    const [menuTrigger, setMenuTrigger] = React.useState<HTMLDivElement | null>(null)

    const cls = cx(prefixCls, className)

    // TODO：处理 column 模型支持 cellRender，一直出 checkbox、expandIcon 高级选项
    return (
      <div ref={ref} role={role} className={cls}>
        {/* @ts-ignore */}
        <IconButton ref={setMenuTrigger} icon={<DownOutlined />} />

        <Popper
          className={`${prefixCls}__popper`}
          visible={menuVisible}
          attachEl={menuTrigger}
          zIndex={1040}
        >
          <div className={`${prefixCls}__content`}>
            {canSort ? (
              <TableColumnMenuItem
                prefixCls={prefixCls}
                active={activeSorterType === 'ascend' && activeSorterColumn === columnKey}
                // {/* TODO: 国际化 */}
                // {/* {localeDatas.table.ascend} */}
                content={'递增'}
                icon={<SortAscendingOutlined />}
                onClick={() => {
                  if (activeSorterType === 'ascend' && activeSorterColumn === columnKey) {
                    setActiveSorterType(null)
                    setActiveSorterColumn(null)
                  } else {
                    setActiveSorterType('ascend')
                    setActiveSorterColumn(columnKey)
                  }
                  menuVisibleAction.off()
                }}
              />
            ) : null}

            {canSort ? (
              <TableColumnMenuItem
                prefixCls={prefixCls}
                active={activeSorterType === 'descend' && activeSorterColumn === columnKey}
                // {/* TODO: 国际化 */}
                // {/* {localeDatas.table.descend} */}
                content={'递减'}
                icon={<SortDescendingOutlined />}
                onClick={() => {
                  if (activeSorterType === 'descend' && activeSorterColumn === columnKey) {
                    setActiveSorterType(null)
                    setActiveSorterColumn(null)
                  } else {
                    setActiveSorterType('descend')
                    setActiveSorterColumn(columnKey)
                  }
                  menuVisibleAction.off()
                }}
              />
            ) : null}

            <TableColumnMenuItem
              prefixCls={prefixCls}
              active={highlightColumns.includes(columnKey)}
              // {/* TODO: 国际化 */}
              // {/* {localeDatas.table.highlight} */}
              content={'高亮'}
              icon={<ColumnHeightOutlined />}
              onClick={() => {
                if (highlightColumns.includes(columnKey)) {
                  setHighlightColumns(highlightColumns.filter((c) => c !== columnKey))
                } else {
                  setHighlightColumns(highlightColumns.concat(columnKey))
                }
                menuVisibleAction.off()
              }}
            />

            <TableColumnMenuItem
              prefixCls={prefixCls}
              active={freezeColumn === columnKey}
              // {/* TODO: 国际化 */}
              // {/* {localeDatas.table.freeze} */}
              content={'冻结'}
              icon={<LockOutlined />}
              onClick={() => {
                if (freezeColumn === columnKey) {
                  setFreezeColumn(null)
                } else {
                  setFreezeColumn(columnKey)
                }
                menuVisibleAction.off()
              }}
            />
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
  TableColumnMenu.displayName = 'TableColumnMenu'
}

export const TableColumnMenuItem = ({ prefixCls, active, onClick, content, icon }: any) => {
  return (
    <div
      className={cx(`${prefixCls}__item`, active && `${prefixCls}__item--active`)}
      onClick={onClick}
    >
      <span>{content}</span>
      {icon}
    </div>
  )
}
