import React from 'react'
import Skeleton from '../src'

export const Type = () => {
  return (
    <>
      <h1>Type 类型</h1>
      <h2>text 文本骨架</h2>
      <Skeleton.Group animation="wave">
        <Skeleton type="text"></Skeleton>
        <Skeleton type="text"></Skeleton>
        <Skeleton type="text"></Skeleton>
      </Skeleton.Group>
      <h2>avatar 头像骨架</h2>
      <div className="skeleton-basic__wrap">
        <Skeleton visible={true} animation="wave" type="avatar"></Skeleton>
      </div>
      <h2>image 图像骨架</h2>
      <div className="skeleton-basic__wrap" style={{ width: '150px', height: '100px' }}>
        <Skeleton visible={true} animation="wave" type="image"></Skeleton>
      </div>
      <h2>icon 图标骨架</h2>
      <div className="skeleton-basic__wrap">
        <Skeleton visible={true} animation="wave" type="icon"></Skeleton>
      </div>
    </>
  )
}
