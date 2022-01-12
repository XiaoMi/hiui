import React from 'react'
import { cx } from '@hi-ui/classname'
import { useTableContext } from './context'
import { TableColumnMenu } from './TableColumnMenu'
import Select from '@hi-ui/select'
import { CaretDownFilled, CaretUpFilled } from '@hi-ui/icons'
import Popper from '@hi-ui/popper'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { isFunction } from '@hi-ui/type-assertion'

export const renderFilter = ({ prefixCls, columnKey, column, showColMenu }: RenderFilterProps) => {
  const { sorter, filterIcon, selectFilters } = column.raw

  return [
    showColMenu && (
      <TableColumnMenu
        prefixCls={`${prefixCls}-dropdown`}
        key="0"
        columnKey={columnKey}
        column={column}
      />
    ),
    sorter && !showColMenu && (
      <SorterMenu prefixCls={`${prefixCls}-sorter`} key="1" column={column} />
    ),
    selectFilters && <Select prefixCls={`${prefixCls}-select`} key="2" {...selectFilters} />,
    filterIcon && <FilterDropdown prefixCls={`${prefixCls}-custom`} key="3" column={column} />,
  ].filter(Boolean)
}

export interface RenderFilterProps {
  prefixCls?: string
  columnKey?: string
  column?: any
  showColMenu?: boolean
}

export const SorterMenu = ({ prefixCls, column }: any) => {
  const columnKey = column.dataKey

  const {
    activeSorterColumn,
    activeSorterType,
    setActiveSorterColumn,
    setActiveSorterType,
  } = useTableContext()

  return (
    <div className={prefixCls}>
      <span
        className={cx(`${prefixCls}__icon`, {
          [`${prefixCls}__icon--active`]:
            activeSorterType === 'ascend' && activeSorterColumn === columnKey,
        })}
        onClick={(e) => {
          if (activeSorterType === 'ascend' && activeSorterColumn === columnKey) {
            setActiveSorterType(null)
            setActiveSorterColumn(null)
          } else {
            setActiveSorterType('ascend')
            setActiveSorterColumn(columnKey)
          }
        }}
      >
        <CaretUpFilled />
      </span>
      <span
        className={cx(`${prefixCls}__icon`, {
          [`${prefixCls}__icon--active`]:
            activeSorterType === 'descend' && activeSorterColumn === columnKey,
        })}
        onClick={(e) => {
          if (activeSorterType === 'descend' && activeSorterColumn === columnKey) {
            setActiveSorterType(null)
            setActiveSorterColumn(null)
          } else {
            setActiveSorterType('descend')
            setActiveSorterColumn(columnKey)
          }
        }}
      >
        <CaretDownFilled />
      </span>
    </div>
  )
}

export const FilterDropdown = ({ prefixCls, column }: any) => {
  const {
    filterIcon,
    filterDropdown,
    filterDropdownWidth,
    onFilterDropdownVisibleChange,
    filterDropdownClassName,
  } = column.raw
  const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
    onOpen: () => onFilterDropdownVisibleChange?.(true, column),
    onClose: () => onFilterDropdownVisibleChange?.(false, column),
  })
  const [menuTrigger, setMenuTrigger] = React.useState<HTMLSpanElement | null>(null)

  return (
    <>
      <span
        className={`${prefixCls}__trigger`}
        ref={setMenuTrigger}
        onClick={menuVisibleAction.not}
      >
        {filterIcon}
      </span>
      <Popper
        className={`${prefixCls}__popper`}
        visible={menuVisible}
        attachEl={menuTrigger}
        onClose={menuVisibleAction.off}
        // @DesignToken zIndex: `overlay`
        zIndex={1050}
      >
        <div
          className={cx(`${prefixCls}__content`, filterDropdownClassName)}
          style={{ width: filterDropdownWidth }}
        >
          {isFunction(filterDropdown)
            ? filterDropdown({
                columnData: column,
                setFilterDropdownVisible: menuVisibleAction.set,
              })
            : null}
        </div>
      </Popper>
    </>
  )
}
