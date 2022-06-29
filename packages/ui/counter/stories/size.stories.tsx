import React from 'react'
import Counter from '../src'

/**
 * @title 不同尺寸
 */
export const Size = () => {
  return (
    <>
      <h1>Counter size</h1>
      <div style={{ display: 'flex', gap: 160 }}>
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <Counter size={'sm'} />
          <Counter size="md" />
          <Counter size={'lg'} />
        </div>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <Counter size={'sm'} appearance={'filled'} />
          <Counter size="md" appearance={'filled'} />
          <Counter size={'lg'} appearance={'filled'} />
        </div>
      </div>
    </>
  )
}
