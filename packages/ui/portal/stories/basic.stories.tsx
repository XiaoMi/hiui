import React from 'react'
import Portal from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Basic</h1>
      <div className="portal-basic__wrap">
        <Portal>
          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              padding: 20,
              background: 'rgb(160, 182, 249)',
            }}
          >
            Portal
          </div>
        </Portal>
      </div>
    </>
  )
}
