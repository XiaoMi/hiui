import React from 'react'
import Loading from '../src'

/**
 * @title 文案位置
 */
export const ContentPosition = () => {
  const loadingIdRef = React.useRef<any>(null)

  React.useEffect(() => {
    return () => {
      Loading.close(loadingIdRef.current)
    }
  }, [])

  return (
    <>
      <h1>Content Position</h1>
      <div
        className="loading-content-position__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Loading visible size="sm" content="Loading..." contentPosition="right">
          <div
            style={{
              // width: 500,
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
