import React from 'react'
import Rating from '../src'

/**
 * @title 基础用法
 * @desc 评定业务指标、信用等级、满意度等
 */
export const Character = () => {
  return (
    <>
      <h1>Character</h1>
      <div className="rating-character__wrap">
        <h2>文字字符</h2>
        <Rating defaultValue={3} character="HiUI" />

        <br />
        <h2>图片字符</h2>
        <Rating
          defaultValue={3.5}
          character={
            <img
              src="https://cdn.cnbj1.fds.api.mi-img.com/hiui-template/resources/images/HiUI/logo.png"
              style={{ width: 24, height: 24 }}
            />
          }
        />
      </div>
    </>
  )
}
