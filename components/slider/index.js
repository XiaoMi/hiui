import React, { useState, useRef, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import './style'
import { set } from 'lodash'
const prefixCls = 'hi-slider'
const Slider = ({ defaultValue, max = 100, min = 0, range, step = 1 }) => {
  const [value, setValue] = useState(defaultValue)
  // 是否可拖动
  const [canMove, setCanMove] = useState(false)

  const [downTarget, setDownTarget] = useState()

  const sliderRef = useRef()

  // 抬起
  const onMouseUp = useCallback(
    (e) => {
      console.log('up')
      setCanMove(false)
      setDownTarget(null)
    },
    [canMove, downTarget]
  )

  // 移动
  const onMouseMove = useCallback(
    (e) => {
      const parent = sliderRef.current
      // console.log(downTarget,e);

      // setValue(e.clientX > downTarget.clientX ? value++ : value--);

      // setDownTarget(e);
      // console.log(sliderRef.current.offsetLeft);
      // console.log(e.clientX);
      console.log(downTarget)
      if (canMove && downTarget) {
        console.log(e.clientX, downTarget.clientX)
        // setValue(e.clientX > downTarget.clientX ? value++ : value--);

        // setDownTarget(e);
      }
    },
    [canMove, downTarget]
  )

  useEffect(() => {
    setHandlePosition()
  }, [])

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
    }
  })

  // 设置 handle 位置
  const setHandlePosition = useCallback(() => {
    const parent = sliderRef.current
    // const { width } = parent.getBoundingClientRect();
    // 每一份
    const trackWidth = (value / (max - min)) * 100

    parent.getElementsByClassName(`${prefixCls}__track`)[0].style.width =
      trackWidth + '%'

    if (!range) {
      parent.getElementsByClassName(`${prefixCls}__handle`)[0].style.left =
        trackWidth - 1 + '%'
    } else {
    }
  }, [value])

  // 落下
  const onMouseDown = useCallback(
    (e) => {
      setCanMove(true)
      setDownTarget(e)

      if (!range) {
      }
    },
    [canMove, downTarget]
  )

  return (
    <div className={prefixCls} ref={sliderRef}>
      <div className={`${prefixCls}__rail`} />
      <div className={`${prefixCls}__track`} />
      <div className={`${prefixCls}__step`} />
      <div
        className={`${prefixCls}__handle ${prefixCls}__handle-1`}
        onMouseDown={onMouseDown}
        // onMouseMove={onMouseMove}
        // onMouseUp={onMouseUp}
      />
      {/* <div className={`${prefixCls}__handle ${prefixCls}__handle-2`} ></div> */}
    </div>
  )
}

export default Slider
