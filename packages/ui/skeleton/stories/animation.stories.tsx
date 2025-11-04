import React from 'react'
import Skeleton from '../src'

export const Animation = () => {
  return (
    <>
      <h1>Animation 动画</h1>
      <h2>wave 波浪动画</h2>
      <div className="skeleton-basic__wrap">
        <Skeleton.Group visible={true} animation="wave">
          <Skeleton.Group layout="horizontal">
            <Skeleton type="icon"></Skeleton>
            <Skeleton.Group>
              <Skeleton width={'30%'}></Skeleton>
              <Skeleton width={'70%'}></Skeleton>
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton type="image" height={200}></Skeleton>
          <Skeleton.Group layout="horizontal">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton.Group layout="horizontal">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
        </Skeleton.Group>
      </div>
      <h2>pulse 呼吸动画</h2>
      <div className="skeleton-basic__wrap">
        <Skeleton.Group visible={true} animation="pulse">
          <Skeleton.Group layout="horizontal">
            <Skeleton type="icon"></Skeleton>
            <Skeleton.Group>
              <Skeleton width={'30%'}></Skeleton>
              <Skeleton width={'70%'}></Skeleton>
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton type="image" height={200}></Skeleton>
          <Skeleton.Group layout="horizontal">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton.Group layout="horizontal">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
        </Skeleton.Group>
      </div>
      <h2>none 无动画</h2>
      <div className="skeleton-basic__wrap">
        <Skeleton.Group visible={true} animation="none">
          <Skeleton.Group layout="horizontal">
            <Skeleton type="icon"></Skeleton>
            <Skeleton.Group>
              <Skeleton width={'30%'}></Skeleton>
              <Skeleton width={'70%'}></Skeleton>
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton type="image" height={200}></Skeleton>
          <Skeleton.Group layout="horizontal">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton.Group layout="horizontal">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
        </Skeleton.Group>
      </div>
    </>
  )
}
