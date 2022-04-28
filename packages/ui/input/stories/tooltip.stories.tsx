import React from 'react'
import Input from '../src'
import HiTooltip from '@hi-ui/tooltip'

/**
 * @title 带Tooltip
 */
export const Tooltip = () => {
  const [value, setValue] = React.useState('Tooltip')

  return (
    <>
      <h1>Tooltip for Input</h1>
      <div className="input-Tooltip__wrap">
        <HiTooltip trigger="focus" title={value || '请输入'}>
          <Input
            placeholder="请输入"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></Input>
        </HiTooltip>
      </div>
    </>
  )
}
