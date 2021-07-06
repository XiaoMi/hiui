import React from 'react'
import Loading from '../src'

export const Basic = () => {
  const loadingRef = React.useRef(null)

  React.useEffect(() => {
    return () => {
      loadingRef.current.close()
    }
  }, [])

  return (
    <>
      <h1>Loading</h1>
      <div className="loading-basic__wrap">
        <Loading label="Loading..." delay={500}>
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
              loadingRef.current = Loading.open()
            }}
          >
            Awake by API
          </button>
        </div>
      </div>
    </>
  )
}
