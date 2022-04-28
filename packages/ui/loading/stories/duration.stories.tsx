import React from 'react'
import Loading from '../src'

/**
 * @title API调用
 */
export const Duration = () => {
  const loadingIdRef = React.useRef(null)

  React.useEffect(() => {
    return () => {
      Loading.close(loadingIdRef.current)
    }
  }, [])

  return (
    <>
      <h1>Loading</h1>
      <div className="loading-duration__wrap">
        <button
          onClick={() => {
            loadingIdRef.current = Loading.open(undefined, { duration: 3000 })
          }}
        >
          Awake by API
        </button>
      </div>
    </>
  )
}
