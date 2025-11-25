import React from 'react'
import Skeleton from '../src'

/**
 * @title 动画选项
 */
export const Animation = () => {
  return (
    <>
      <h1>Animation</h1>
      <h2>wave 波浪动画</h2>
      <div>
        <Skeleton.Group visible={true} animation="wave">
          <Skeleton.Group direction="row">
            <Skeleton type="icon"></Skeleton>
            <Skeleton.Group>
              <Skeleton width={'30%'}></Skeleton>
              <Skeleton width={'70%'}></Skeleton>
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton type="image" height={200}></Skeleton>
          <Skeleton.Group direction="row">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton.Group direction="row">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
        </Skeleton.Group>
      </div>
      <h2>pulse 呼吸动画</h2>
      <div>
        <Skeleton.Group visible={true} animation="pulse">
          <Skeleton.Group direction="row">
            <Skeleton type="icon"></Skeleton>
            <Skeleton.Group>
              <Skeleton width={'30%'}></Skeleton>
              <Skeleton width={'70%'}></Skeleton>
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton type="image" height={200}></Skeleton>
          <Skeleton.Group direction="row">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton.Group direction="row">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
        </Skeleton.Group>
      </div>
      <h2>none 无动画</h2>
      <div>
        <Skeleton.Group visible={true} animation="none">
          <Skeleton.Group direction="row">
            <Skeleton type="icon"></Skeleton>
            <Skeleton.Group>
              <Skeleton width={'30%'}></Skeleton>
              <Skeleton width={'70%'}></Skeleton>
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton type="image" height={200}></Skeleton>
          <Skeleton.Group direction="row">
            <Skeleton type="avatar" />
            <Skeleton.Group>
              <Skeleton />
              <Skeleton />
            </Skeleton.Group>
          </Skeleton.Group>
          <Skeleton.Group direction="row">
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
