import React from 'react'
import Loading from '../src'

export const Basic = () => {
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
              marginLeft: 100,
              padding: 20,
              border: '20px solid #000',
            }}
          />
        </Loading>
        <div>
          <button
            onClick={() => {
              Loading.open()
            }}
          >
            API
          </button>
        </div>
      </div>
    </>
  )
}
