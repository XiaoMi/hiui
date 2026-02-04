import React from 'react'
import { useControllableValue } from 'ahooks'
import { CaretUpFilled, CaretDownFilled } from '@hi-ui/icons'
import { cx } from '@hi-ui/classname'
import Tooltip from '@hi-ui/tooltip'
import { cls, clsPrefix } from './utils'
import type { TableSorterProps, SortDirection } from './type'
import './index.scss'
import { getBoolConfig } from '@hi-ui/schema-utils'

export type { TableSorterProps, SortDirection }

export function TableSorter(props: TableSorterProps) {
  const {
    // props
    disabled = false,
  } = props

  const tooltipConfig = getBoolConfig(
    props.tooltip,
    {
      text: {
        // 默认提示当前状态的下一个状态
        asc: '点击降序',
        desc: '取消排序',
        default: '点击升序',
      },
    },
    { mergeDft: true }
  )
  const enableTooltip = !!tooltipConfig

  const [direction, setDirection] = useControllableValue<SortDirection>(props, {
    valuePropName: 'direction',
  })

  const handleClick = () => {
    if (disabled) return

    // 排序方向切换逻辑：null -> asc -> desc -> null
    let nextDirection: SortDirection | null = 'asc'
    if (direction === 'asc') nextDirection = 'desc'
    else if (direction === 'desc') nextDirection = null

    setDirection(nextDirection)
  }

  // 根据当前排序方向确定提示文本
  const getTooltipTitle = () => {
    const tooltipText = tooltipConfig?.text
    if (!tooltipText) return undefined

    const state = direction || 'default'
    const map = {
      asc: tooltipText.asc,
      desc: tooltipText.desc,
      default: tooltipText.default,
    }

    return map[state]
  }

  const sorterEl = (
    <span className={cx(clsPrefix)} onClick={handleClick} data-disabled={disabled}>
      <span className={cls('icon', 'icon-up')} data-active={direction === 'asc'}>
        <CaretUpFilled size={14} />
      </span>

      <span className={cls('icon', 'icon-down')} data-active={direction === 'desc'}>
        <CaretDownFilled size={14} />
      </span>
    </span>
  )

  return enableTooltip ? (
    <Tooltip title={getTooltipTitle()}>{sorterEl}</Tooltip>
  ) : (
    // sorterEl
    sorterEl
  )
}
