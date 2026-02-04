import React from 'react'
import { cx } from '@hi-ui/classname'
import { Popover } from '@hi-ui/popover'
import { FilterFilled } from '@hi-ui/icons'
import { mergeProps } from '@hi-ui/schema-utils'
import { TextFilter } from './filters/text'
import { NumberFilter } from './filters/number'
import { SelectFilter } from './filters/select'
import { DateFilter } from './filters/date'
import { cls } from './utils'
import type {
  TableFilterProps,
  FilterValueType,
  FilterType,
  FilterExtraOptsType,
  CommonFilterProps,
  CustomFilterProps,
  TextFilterProps,
  NumberFilterProps,
  SelectFilterProps,
  DateFilterProps,
} from './type'
import './index.scss'

function hasFilterValue(value: FilterValueType, type?: FilterType) {
  if (!value || !value.length) return false
  // if (value.filter(Boolean).length === 0) return false

  switch (type) {
    case 'number':
      // 范围筛选需要判断是否有任意一个实际的数值
      return value.some((v) => v != null && v !== '')
    case 'date':
      // 日期范围筛选判断是否有值
      return value.length > 0 && value.some((v) => v != null && v !== '')
    case 'select':
      // 选择筛选直接判断长度
      return value.length > 0
    default:
      return value.length > 0
  }
}

export function TableFilter(props: TableFilterProps) {
  const { value = [], onChange, trigger, type } = props
  const [visible, setVisible] = React.useState(false)

  const handleOpen = () => {
    setVisible(true)
    props.popoverProps?.onOpen?.()
  }

  const handleClose = () => {
    setVisible(false)
    props.onClose?.()
    props.popoverProps?.onClose?.()
  }

  const renderContent = () => {
    let ContentComponent: React.ComponentType<AnyType>
    let extraProps: AnyObject = {}

    switch (props.type) {
      case 'custom':
        ContentComponent = props.overlay || (() => <>请传入自定义筛选器组件！</>)
        if (!props.overlay) {
          console.error('TableFilter: 类型为 custom 时，必须传入自定义筛选器！')
        }
        break
      case 'select':
        ContentComponent = SelectFilter
        extraProps = {
          options: props.options,
          showCheckAll: props.showCheckAll,
        }
        break
      case 'number':
        ContentComponent = NumberFilter
        break
      case 'date':
        ContentComponent = DateFilter
        break
      case 'text':
      default:
        ContentComponent = TextFilter
    }

    return (
      <ContentComponent value={value} onChange={onChange} onClose={handleClose} {...extraProps} />
    )
  }

  const renderTrigger = () => {
    const isActive = hasFilterValue(value, type)
    const className = cls('trigger')

    if (trigger) {
      return React.cloneElement(trigger as React.ReactElement, {
        className,
        dataActive: isActive,
      })
    }

    return (
      <span className={className} data-trigger-type="builtin" data-active={isActive}>
        <FilterFilled />
      </span>
    )
  }

  const popoverProps = mergeProps({}, props.popoverProps, {
    className: cx(cls('popover'), props.popoverProps?.className),
    onOpen: handleOpen,
    onClose: handleClose,
  })

  return (
    <Popover
      visible={visible}
      trigger="click"
      placement="bottom-start"
      content={visible ? renderContent() : undefined}
      className={cls('popover')}
      {...popoverProps}
    >
      {renderTrigger()}
    </Popover>
  )
}

export type {
  TableFilterProps,
  FilterExtraOptsType,
  FilterValueType,
  CommonFilterProps,
  FilterType,
  CustomFilterProps,
  TextFilterProps,
  NumberFilterProps,
  SelectFilterProps,
  DateFilterProps,
}
export type { SelectFilterOptions } from './filters/select'
