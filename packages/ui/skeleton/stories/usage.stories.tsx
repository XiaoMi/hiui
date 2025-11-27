import React from 'react'
import Skeleton from '../src'
import Button from '@hi-ui/button'

/**
 * @title 不同用法
 */
export const Usage = () => {
  const [visible, setVisible] = React.useState(true)

  return (
    <>
      <h1>不同用法</h1>
      <h2>用法1: 包覆式</h2>
      <div style={{ marginBottom: '16px' }}>
        <Skeleton visible={visible} type="text">
          <div>有朋自远方来，不亦乐乎？</div>
        </Skeleton>
      </div>

      <h2>用法2: 独立式</h2>
      <div style={{ marginBottom: '16px' }}>
        {visible ? <Skeleton type="text"></Skeleton> : <div>人不知而不愠，不亦君子乎？</div>}
      </div>
      <Button onClick={() => setVisible(!visible)}>
        {visible ? 'Hide Skeleton' : 'Show Skeleton'}
      </Button>
    </>
  )
}
