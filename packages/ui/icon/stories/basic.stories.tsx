import React from 'react'
import Icon from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Icon</h1>
      <div className="icon-basic__wrap">
        <span style={{ color: 'royalblue', fontSize: '32px' }}>
          <Icon.AdditionalBusinessOutlined
            onClick={(e) => console.error(e)}
          ></Icon.AdditionalBusinessOutlined>
        </span>
        <span style={{ color: 'red', fontSize: '64px' }}>
          <Icon.FileFilled />
        </span>
      </div>
    </>
  )
}
