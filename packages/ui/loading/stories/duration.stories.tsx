import React from 'react'
import Loading from '../src'
import Button from '@hi-ui/button'

/**
 * @title API调用
 */
export const Duration = () => {
  const loadingIdRef = React.useRef<any>(null)

  React.useEffect(() => {
    return () => {
      Loading.close(loadingIdRef.current)
    }
  }, [])

  return (
    <>
      <h1>Loading</h1>
      <div className="loading-duration__wrap">
        <Button
          onClick={() => {
            loadingIdRef.current = Loading.open(undefined, { duration: 3000 })
          }}
        >
          Awake by API
        </Button>
      </div>
    </>
  )
}
