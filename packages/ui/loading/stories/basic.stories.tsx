import React from 'react'
import Loading from '../src'

/**
 * @title 基础用法
 * @desc 耐心等待，正拼力加载…
 */
export const Basic = () => {
  const loadingIdRef = React.useRef<any>(null)

  React.useEffect(() => {
    return () => {
      Loading.close(loadingIdRef.current)
    }
  }, [])

  return (
    <>
      <h1>Loading</h1>
      <div
        className="loading-basic__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Loading content="Loading..." delay={500}>
          <div
            style={{
              // width: 500,
              height: 300,
              boxSizing: 'border-box',
              background: '#f5f7fa',
              padding: 20,
              border: '20px solid #5f6a7a',
            }}
          ></div>
        </Loading>
      </div>
    </>
  )
}
