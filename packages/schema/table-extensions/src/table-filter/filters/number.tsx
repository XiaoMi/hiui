import React from 'react'
import { NumberInput } from '@hi-ui/number-input'
import { Button } from '@hi-ui/button'
import { cls } from '../utils'
import type { CommonFilterProps } from '../type'

export type BuiltinNumberFilterProps = CommonFilterProps

export function NumberFilter(props: BuiltinNumberFilterProps) {
  const { value = [], onChange } = props
  const [localValue, setLocalValue] = React.useState(value as [(number | null)?, (number | null)?])
  const [min = null, max = null] = localValue

  const handleConfirm = () => {
    onChange(localValue.some((v) => v != null) ? localValue : undefined)
    props.onClose?.()
  }

  const handleReset = () => {
    setLocalValue([])
    onChange()
    props.onClose?.()
  }

  return (
    <div className={cls('container')} data-filter-type="number">
      <div className={cls('content')} style={{ display: 'flex', gap: 8 }}>
        <NumberInput
          className={cls('input')}
          value={min}
          onChange={(val) => setLocalValue([val ?? undefined, max])}
          placeholder="Min"
          max={max ?? undefined}
        />

        <span style={{ display: 'inline-flex', alignItems: 'center' }}>-</span>

        <NumberInput
          className={cls('input')}
          value={max}
          onChange={(val) => setLocalValue([min, val ?? undefined])}
          placeholder="Max"
          min={min ?? undefined}
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
