import React from 'react'
import Skeleton from '../src'
import Button from '@hi-ui/button'

export const Usage = () => {
  const [loading, setLoading] = React.useState(true)

  return (
    <>
      <h1>用法</h1>
      <h2>用法1: 包覆式</h2>
      <div className="skeleton-basic__wrap" style={{ marginBottom: '16px' }}>
        <Skeleton loading={loading} type="text">
          <div>有朋自远方来，不亦乐乎？</div>
        </Skeleton>
      </div>
      <h2>用法2: 独立式</h2>
      <div className="skeleton-basic__wrap" style={{ marginBottom: '16px' }}>
        {loading ? <Skeleton type="text"></Skeleton> : <div>人不知而不愠，不亦君子乎？</div>}
      </div>
      <Button onClick={() => setLoading(!loading)}>
        {loading ? 'Hide Skeleton' : 'Show Skeleton'}
      </Button>
    </>
  )
}
