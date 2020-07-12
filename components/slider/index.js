import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import classNames from 'classnames'
import './style'
import Tooltip from '../tooltip'
const prefixCls = 'hi-slider'
const noop = () => { }
const Slider = memo(
  ({
    defaultValue = 0,
    max,
    min,
    step = 1,
    vertical,
    onChange = noop,
    value: initValue,
    disabled = false,
    tipFormatter,
    type = 'primary',
    marks = {}
  }) => {
    const [value, setValue] = useState(initValue || defaultValue)

    // 是否可拖动
    const [canMove, setCanMove] = useState(false)

    const [startX, setStartX] = useState()
    const [startY, setStartY] = useState()


    const [newRightPosition, setNewRightPosition] = useState(0)
    const [startPosition, setStartPosition] = useState(0)
    const [positionStep, setPositionStep] = useState(1)

    const sliderRef = useRef()
    const tooltipRef = useRef()
    const valueRef = useRef()

    const onMouseUp = useCallback(
      (e) => {
        setCanMove(false)
        setStartPosition(newRightPosition)
        // if (initValue === undefined) {
        //   setStartPosition(newRightPosition)
        // }
      },
      [newRightPosition, initValue]
    )
    useEffect(() => {
      max = max || 100
      min = min || 0
      setPositionStep((step / (max - min)) * 100)
    }, [step, max, min])

    useEffect(() => {
      if (initValue !== undefined) {
        max = max || 100
        min = min || 0
        let value = initValue;
        if (initValue > max) {
          value = max
        } else if (initValue < min) {
          value = min
        }
        setValue(value)
        if (value !== initValue) {
          onChange(value)
        }
        // console.log(((initValue - min) / (max - min)) * 100)
        // setStartPosition(((initValue - min) / (max - min)) * 100)
      }
    }, [initValue,max,min])
    useEffect(()=>{
      if(initValue!==undefined){
        // setStartPosition(((initValue - min) / (max - min)) * 100)
      }
      
    },[initValue])
    // 移动
    const onMouseMove = useCallback((e) => {
      if (canMove) {
        const parent = sliderRef.current

        max = max || 100
        min = min || 0

        const {
          width: sliderWidth,
          height: sliderHeight
        } = parent.getBoundingClientRect()

        let diff = 0
        let changeValue = 0

        if (vertical) {
          diff =
            Math.round(
              (((e.clientY - startY) / sliderHeight) * 100) / positionStep
            ) * positionStep
        } else {
          diff =
            Math.round(
              (((e.clientX - startX) / sliderWidth) * 100) / positionStep
            ) * positionStep
        }

        let position = startPosition + diff
        console.log(startPosition)
        if (position <= 0) {
          position = 0
        } else if (position >= 100) {
          position = 100
        }

        changeValue = min + Math.round(((max - min) * position) / 100)
        if (changeValue < min) {
          changeValue = min
        } else if (changeValue > max) {
          changeValue = max
        }

        if (initValue === undefined) {
          setValue(changeValue)
        }
        setNewRightPosition(position)
        onChange(changeValue)

      }
    } , [canMove, max, min, vertical, positionStep, startPosition, initValue])

    // 初始化设置宽度和left
    useEffect(() => {
      setNewRightPosition(getTrackWidth())
     
    },[])

    useEffect(() => {

      if (initValue === undefined) {
        console.log(getTrackWidth())
        setStartPosition(getTrackWidth())
      }

    }, [initValue])


    useEffect(() => {

      if (disabled) {
        return
      }
      if (canMove) {
        window.onmouseup = (e) => {
          onMouseUp(e)
        }
        window.onmousemove = (e) => {
          onMouseMove(e)
        }
      } else {
        window.onmouseup = () => { }
        window.onmousemove = () => { }

      }
    }, [canMove, disabled, newRightPosition, initValue, startPosition, positionStep, vertical, min, max])
    // newRightPosition, initValue, startPosition, positionStep, vertical, min, max

    // 获取 track 宽度
    const getTrackWidth = useCallback(() => {
      min = min || 0
      max = max || 100
      return ((value - min) / (max - min)) * 100
    }, [value, max, min])

    // 鼠标落下
    const onMouseDown = useCallback(
      (e) => {
        if (disabled) {
          return
        }
        const { clientX, clientY } = e
        setCanMove(true)

        if (vertical) {
          setStartY(clientY)
        } else {
          setStartX(clientX)
        }

      },
      [disabled, vertical]
    )
    // 展示 tooltip
    const optTooltip = useCallback(() => {
      Tooltip.close('slider-tooltip')
      let title = tipFormatter ? tipFormatter(valueRef.current) : valueRef.current
      Tooltip.open(tooltipRef.current, {
        title,
        placement: vertical ? 'right' : 'top',
        key: 'slider-tooltip'
      })
    }, [step])

    const onMouseEnter = useCallback(
      (e) => {
        // optTooltip()
      },
      [value]
    )

    const onMouseLeave = useCallback((e) => {
      // Tooltip.close('slider-tooltip')
    })

    const onHandleClick = useCallback(
      (e) => {
        e.stopPropagation()
        // optTooltip()
      },
      [value]
    )
    // slider 点击
    const railClick = useCallback(
      (e) => {
        if (disabled) {
          return
        }

        min = min || 0
        max = max || 100

        const parent = sliderRef.current
        let diff = 0
        let position
        const {
          width: sliderWidth,
          height: sliderHeight,
          left, top
        } = parent.getBoundingClientRect()
        const { x, y } = tooltipRef.current.getBoundingClientRect()

        if (vertical) {
          diff =
            Math.round(
              (((e.clientY - y) / sliderHeight) * 100) / positionStep
            ) * positionStep
          position = newRightPosition + diff
        } else {

          diff =
            Math.round((((e.clientX - x) / sliderWidth) * 100) / positionStep) *
            positionStep
          position = e.clientX <= left ? 0 : newRightPosition + diff
        }

        // position = newRightPosition + diff

        if (position <= 0) {
          position = 0
        } else if (position >= 100) {
          position = 100
        }
        if (initValue === undefined) {

         

          setValue(min + Math.round(((max - min) * position) / 100))

          // optTooltip()
        }
        setNewRightPosition(position)
        onChange(min + Math.round(((max - min) * position) / 100))

        // optTooltip()
      },
      [positionStep, newRightPosition, vertical, disabled]
    )

    const sliderClasses = classNames(prefixCls, {
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--vertical`]: vertical,
      [`${prefixCls}--${type}`]: true
    })

    return (
      <div
        className={sliderClasses}
        ref={sliderRef}
        onClick={railClick}
        onMouseLeave={onMouseLeave}
      >
        <div className={`${prefixCls}__rail`} />
        <div
          className={`${prefixCls}__track`}
          style={{
            [!vertical ? 'width' : 'height']: `${newRightPosition.toFixed(4)}%`,
            [!vertical ? 'left' : 'top']: 0
          }}
        />

        <div
          className={`${prefixCls}__handle ${prefixCls}__handle-1`}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          ref={tooltipRef}
          onClick={onHandleClick}
          style={{
            [!vertical ? 'left' : 'top']: `${newRightPosition.toFixed(4)}%`
          }}
          tabIndex='0'
        />
        <div className={`${prefixCls}__step`}>
          {Object.keys(marks).map((item, index) => (
            <span
              className={`${prefixCls}__step-dot`}
              key={index}
              style={{
                [!vertical ? 'left' : 'bottom']: ((item - (min || 0)) / ((max || 100) - (min || 0))) * 100 + '%'

              }}
            />
          ))}
        </div>
        <div className={`${prefixCls}__stepText`}>
          {min && <span className={`${prefixCls}__min ${prefixCls}__stepText-dot`}>{min}</span>}
          {max && <span className={`${prefixCls}__max ${prefixCls}__stepText-dot`}>{max}</span>}
          {Object.entries(marks).map(([key, item], index) => (
            <span
              className={`${prefixCls}__stepText-dot`}
              key={index}
              style={{
                [!vertical ? 'left' : 'bottom']: ((key - (min || 0)) / ((max || 100) - (min || 0))) * 100 + '%',
                transform: !vertical ? 'translateX(-50%)' : 'translateY(50%)'
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    )
  }
)

export default Slider
