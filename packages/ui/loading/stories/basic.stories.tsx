import React from 'react'
import Loading from '../src'

/**
 * @title 基础用法
 * @desc 耐心等待，正拼力加载…
 */
export const Basic = () => {
  const loadingIdRef = React.useRef(null)

  React.useEffect(() => {
    return () => {
      Loading.close(loadingIdRef.current)
    }
  }, [])
  const elementRef = React.useRef()

  return (
    <>
      <h1>Loading</h1>
      <div
        ref={elementRef}
        className="loading-basic__wrap"
        style={{ position: 'relative', width: 500, height: 300 }}
      >
        <Loading content="Loading..." delay={500}>
          <div
            style={{
              width: 500,
              height: 300,
              boxSizing: 'border-box',
              background: '#ccc',
              padding: 20,
              border: '20px solid #000',
            }}
          />
        </Loading>
        <div>
          <button
            onClick={() => {
              loadingIdRef.current = Loading.open(elementRef.current)
            }}
          >
            Awake by API
          </button>
        </div>
      </div>
    </>
  )
}
