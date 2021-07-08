import React from 'react'
import Rate from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Rate</h1>
      <div className="rate-basic__wrap">
        <Rate
          autoFocus
          defaultValue={0.5}
          allowHalf={false}
          halfPlacement="horizontal"
          color="red"
        ></Rate>
        <br />
        <Rate defaultValue={3.5} halfPlacement="vertical"></Rate>
        <br />
        <Rate defaultValue={3.5} halfPlacement="vertical" character="HiUI" />
        <Rate
          defaultValue={3.5}
          halfPlacement="vertical"
          character={
            <img
              src="https://xiaomi.github.io/hiui/static/img/logo.png?241e0618fe55d933c280e38954edea05"
              style={{ width: 24, height: 24 }}
            />
          }
        />
      </div>
    </>
  )
}
