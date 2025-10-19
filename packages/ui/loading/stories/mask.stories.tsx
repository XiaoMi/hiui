import React from 'react'
import Loading from '../src'

/**
 * @title 无蒙层
 */
export const Mask = () => {
  const loadingIdRef = React.useRef<any>(null)

  React.useEffect(() => {
    return () => {
      Loading.close(loadingIdRef.current)
    }
  }, [])

  return (
    <>
      <h1>Mask</h1>
      <div className="loading-mask__wrap" style={{ position: 'relative', width: 500, height: 300 }}>
        <Loading content="Loading..." delay={500} showMask={false}>
          <div
            style={{
              width: 500,
              height: 300,
              boxSizing: 'border-box',
              background: '#f5f7fa',
              padding: 20,
              border: '20px solid #5f6a7a',
            }}
          />
        </Loading>
      </div>
    </>
  )
}
