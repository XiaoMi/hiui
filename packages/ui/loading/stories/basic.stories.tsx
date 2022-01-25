import React from 'react'
import Loading from '../src'

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
      <div ref={elementRef} className="loading-basic__wrap" style={{ position: 'relative' }}>
        <Loading content="Loading..." delay={500}>
          <div
            style={{
              width: 500,
              height: 300,
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
