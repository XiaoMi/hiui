import React from 'react'
import * as Icons from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Icons</h1>
      <div className="icons-basic__wrap">
        <span style={{ color: 'royalblue', fontSize: '32px' }}>
          <Icons.AdditionalBusinessOutlined
            onClick={(e) => console.error(e)}
          ></Icons.AdditionalBusinessOutlined>
        </span>
        <span style={{ color: 'red', fontSize: '64px' }}>
          <Icons.FileFilled />
        </span>
      </div>
    </>
  )
}
