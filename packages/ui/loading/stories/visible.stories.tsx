import React from 'react'
import Loading from '../src'

export const Visible = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <>
      <h1>Visible</h1>
      <div className="loading-visible__wrap">
        <Loading visible={visible} content="Loading..." delay={500}>
          <div
            onClick={() => {
              setVisible((prev) => !prev)
            }}
            style={{
              width: 500,
              height: 300,
              background: '#ccc',
              padding: 20,
              border: '20px solid #000',
            }}
          />
        </Loading>
      </div>
    </>
  )
}
