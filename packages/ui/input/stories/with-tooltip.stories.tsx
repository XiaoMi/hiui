import React from 'react'
import Input from '../src'
import Tooltip from '@hi-ui/tooltip'

/**
 * @title 带Tooltip
 */
export const WithTooltip = () => {
  const [value, setValue] = React.useState('Tooltip')

  return (
    <>
      <h1>带Tooltip</h1>
      <div className="input-Tooltip__wrap">
        <Tooltip trigger="focus" title={value || '请输入'}>
          <Input
            placeholder="请输入"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></Input>
        </Tooltip>
      </div>
    </>
  )
}
