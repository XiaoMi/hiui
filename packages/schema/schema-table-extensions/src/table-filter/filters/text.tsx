import React from 'react'
import { Input } from '@hi-ui/input'
import { Button } from '@hi-ui/button'
import { cls } from '../utils'
import type { CommonFilterProps } from '../type'

export type BuiltinTextFilterProps = CommonFilterProps

export function TextFilter(props: BuiltinTextFilterProps) {
  const { value = [], onChange } = props
  const [localValue, setLocalValue] = React.useState(value[0]?.toString() || '')

  const handleConfirm = () => {
    const text = localValue.trim()
    onChange(text ? [text] : undefined)
    props.onClose?.()
  }

  const handleReset = () => {
    setLocalValue('')
    onChange()
    props.onClose?.()
  }

  return (
    <div className={cls('container')} data-filter-type="text">
      <div className={cls('content')}>
        <Input
          className={cls('input')}
          placeholder="输入筛选条件"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
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
