import React from 'react'
import Rating from '../src'

export const Basic = () => {
  return (
    <>
      <h1>Rating</h1>
      <div className="rating-basic__wrap">
        <Rating
          readOnly
          autoFocus
          defaultValue={4}
          allowHalf={false}
          halfPlacement="horizontal"
          color="red"
        ></Rating>
        <br />
        <Rating defaultValue={3.5} halfPlacement="vertical" onHover={console.log}></Rating>
        <br />
        <Rating defaultValue={3.5} halfPlacement="vertical" character="HiUI" />
        <Rating
          defaultValue={3.5}
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
