import React from 'react'
import { DatePicker } from '@hi-ui/date-picker'
import { Button } from '@hi-ui/button'
import { cls } from '../utils'
import type { CommonFilterProps } from '../type'

export type BuiltinDateFilterProps = CommonFilterProps

export function DateFilter(props: BuiltinDateFilterProps) {
  const { value = [], onChange } = props
  const [localValue, setLocalValue] = React.useState<[string?, string?]>(
    value as [string?, string?]
  )

  const handleChange = (date: unknown, dateStr: string | string[] | null) => {
    let value: [string?, string?] = []
    if (dateStr && Array.isArray(dateStr) && dateStr.length === 2) {
      // 设置时间范围的开始和结束
      value = [dateStr[0] + ' 00:00:00', dateStr[1] + ' 23:59:59']
    }
    setLocalValue(value)
  }

  const handleConfirm = () => {
    onChange(localValue.length ? localValue : undefined)
    props.onClose?.()
  }

  const handleReset = () => {
    setLocalValue([])
    onChange()
    props.onClose?.()
  }

  return (
    <div className={cls('container')} data-filter-type="date">
      <div className={cls('content')} style={{ display: 'flex', gap: 8 }}>
        <DatePicker
          className={cls('input')}
          type="daterange"
          format="YYYY-MM-DD"
          value={
            localValue.length && localValue[0] && localValue[1]
              ? [localValue[0].split(' ')[0], localValue[1].split(' ')[0]]
              : undefined
          }
          onChange={handleChange}
          placeholder={['开始日期', '结束日期']}
          // 禁用弹出层的portal功能，使弹出层保留在DOM树中的原位置
          overlay={{
            disabledPortal: true,
          }}
        />
      </div>
      <div className={cls('footer')}>
        <div className={cls('footer-left')}></div>

        <div className={cls('footer-right')}>
          <Button size="sm" onClick={handleReset}>
            重置
          </Button>
          <Button size="sm" type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}
