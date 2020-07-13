import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import classNames from 'classnames'
import './style'
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
    const [showTooltip, setShowTooltip] = useState(false)
    const sliderRef = useRef()
    const tooltipRef = useRef()
    const valueRef = useRef()

    useEffect(() => {
      max = max || 100
      min = min || 0

      // 每一份步长对应在父元素的百分比
      setPositionStep((step / (max - min)) * 100)
      // 设置初始位置
      setStartPosition(((value - min) / (max - min)) * 100)
    }, [])

    useEffect(() => {
      if (initValue !== undefined) {
        max = max || 100
        min = min || 0
        let value = initValue || 0
        if (initValue > max) {
          value = max
        } else if (initValue < min) {
          value = min
        }
        setValue(value)
        if (value !== initValue) {
          onChange(value)
        }
      }
    }, [initValue])

    // 移动
    const onMouseMove = useCallback(
      (e) => {
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
              -Math.round(
                (((e.clientY - startY) / sliderHeight) * 100) / positionStep
              ) * positionStep
          } else {
            diff =
              Math.round(
                (((e.clientX - startX) / sliderWidth) * 100) / positionStep
              ) * positionStep
          }

          let position = startPosition + diff

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
          console.log(position)
          setNewRightPosition(position)
          onChange(changeValue)
        }
      },
      [canMove, max, min, vertical, positionStep, startPosition, initValue]
    )

    useEffect(() => {
      setNewRightPosition(getTrackWidth())
      valueRef.current = value
    }, [value])

    useEffect(() => {
      if (disabled) {
        return
      }
      if (canMove) {
        window.onmouseup = onMouseUp
        window.onmousemove = onMouseMove
      } else {
        window.onmouseup = () => { }
        window.onmousemove = () => { }
      }
    }, [
      canMove,
      disabled,
      initValue,
      newRightPosition
    ])

    const onMouseUp = useCallback(
      (e) => {
        console.log(newRightPosition)
        setStartPosition(newRightPosition)
        setShowTooltip(false)
        setCanMove(false)
      },
      [newRightPosition]
    )
    // 获取 track 宽度
    const getTrackWidth = useCallback(() => {
      min = min || 0
      max = max || 100
      return ((value - min) / (max - min)) * 100
    }, [value])

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

    const onMouseEnter = useCallback(
      (e) => {
        setShowTooltip(true)
      },
      [value]
    )

    const onHandleClick = useCallback((e) => {
      e.stopPropagation()
      setShowTooltip(true)
    }, [])

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
          left
        } = parent.getBoundingClientRect()
        const { x, y } = tooltipRef.current.getBoundingClientRect()

        if (vertical) {
          diff =
            -Math.round(
              (((e.clientY - y) / sliderHeight) * 100) / positionStep
            ) * positionStep
          position = newRightPosition + diff
        } else {
          diff =
            Math.round((((e.clientX - x) / sliderWidth) * 100) / positionStep) *
            positionStep
          position = e.clientX <= left ? 0 : newRightPosition + diff
        }

        if (position <= 0) {
          position = 0
        } else if (position >= 100) {
          position = 100
        }
        if (initValue === undefined) {
          setValue(min + Math.round(((max - min) * position) / 100))
        }
        setNewRightPosition(position)
        setStartPosition(position)
        valueRef.current = min + Math.round(((max - min) * position) / 100)
        onChange(min + Math.round(((max - min) * position) / 100))
      },
      [positionStep, newRightPosition, vertical, disabled]
    )
    // 点击marks上的点
    const onMarksClick = useCallback((e, value) => {
      e.stopPropagation()
      setNewRightPosition(((value - min) / (max - min)) * 100)
      setStartPosition(((value - min) / (max - min)) * 100)
      if (initValue === undefined) {
        setValue(value)
      }
      onChange(value)
    }, [])
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
      >
        <div className={`${prefixCls}__rail`} />
        <div
          className={`${prefixCls}__track`}
          style={{
            [!vertical ? 'width' : 'height']: `${newRightPosition.toFixed(4)}%`,
            [!vertical ? 'left' : 'bottom']: 0
          }}
        />
        <div
          className={`${prefixCls}__handle ${prefixCls}__handle-1`}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          ref={tooltipRef}
          onClick={onHandleClick}
          style={{
            [!vertical ? 'left' : 'top']: `${
              !vertical
                ? newRightPosition.toFixed(4)
                : (100 - newRightPosition).toFixed(4)
            }%`
          }}
          tabIndex='0'
        >
          {showTooltip && (
            <div
              style={{
                position: 'absolute',
                top: !vertical ? 0 : 5,
                left: !vertical ? 5 : 10,
                width: '100%'
              }}
            >
              <div
                className='hi-popper__container'
                style={{ left: 0, top: 0, zIndex: 1070 }}
              >
                <div
                  className={classNames(
                    'hi-tooltip__popper',
                    'hi-popper__content',
                    {
                      [`hi-popper__content--${vertical ? 'right' : 'top'}`]: true
                    }
                  )}
                  style={{ width: 'auto' }}
                >
                  <div
                    className={classNames('hi-tooltip-base', {
                      [`hi-tooltip-${vertical ? 'right' : 'top'}`]: true
                    })}
                  >
                    {tipFormatter ? tipFormatter(value) : value}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className={`${prefixCls}__step`}>
          {Object.keys(marks).map((item, index) => (
            <span
              className={classNames(`${prefixCls}__step-dot`, {
                [`${prefixCls}__step-dotDisabled`]:
                  value <=
                  ((item - (min || 0)) / ((max || 100) - (min || 0))) * 100
              })}
              key={index}
              style={{
                [!vertical ? 'left' : 'bottom']:
                  ((item - (min || 0)) / ((max || 100) - (min || 0))) * 100 +
                  '%'
              }}
              onClick={(e) =>
                onMarksClick(
                  e,
                  ((item - (min || 0)) / ((max || 100) - (min || 0))) * 100
                )
              }
            />
          ))}
        </div>
        <div className={`${prefixCls}__stepText`}>
          {min && (
            <span className={`${prefixCls}__min ${prefixCls}__stepText-dot`}>
              {min}
            </span>
          )}
          {max && (
            <span className={`${prefixCls}__max ${prefixCls}__stepText-dot`}>
              {max}
            </span>
          )}
          {Object.entries(marks).map(([key, item], index) => (
            <span
              className={`${prefixCls}__stepText-dot`}
              key={index}
              style={{
                [!vertical ? 'left' : 'bottom']:
                  ((key - (min || 0)) / ((max || 100) - (min || 0))) * 100 +
                  '%',
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
