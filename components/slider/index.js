import React, { useState, useRef, useEffect, useCallback, memo } from 'react'
import classNames from 'classnames'
import './style'
import useClickOutside from '../popper/utils/useClickOutside'
import { CSSTransition } from 'react-transition-group'
import Provider from '../context'

const prefixCls = 'hi-slider'
const noop = () => {}
const Slider = memo(
  ({
    defaultValue = 0,
    max: initMax,
    min: initMin,
    step = 1,
    vertical,
    onChange = noop,
    value: initValue,
    disabled = false,
    tipFormatter,
    type = 'primary',
    marks = {},
    theme,
    showRangeLabel = false
  }) => {
    // 是否可拖动
    const [canMove, setCanMove] = useState(false)

    const [startX, setStartX] = useState()
    const [startY, setStartY] = useState()

    const [newRightPosition, setNewRightPosition] = useState(0)
    const [startPosition, setStartPosition] = useState(0)
    const [positionStep, setPositionStep] = useState(1)
    const [showTooltip, setShowTooltip] = useState(false)
    const [firstTime, setFirstTime] = useState(0)
    const [lastTime, setLastTime] = useState(0)
    const [isMove, setIsMove] = useState(false)
    const [max, setMax] = useState(initMax || 100)
    const [min, setMin] = useState(initMin || 0)
    const [isInitPage, setIsInitPage] = useState(true)
    const sliderRef = useRef()
    const tooltipRef = useRef()
    const getValue = useCallback(
      (value) => {
        if (value === undefined) {
          return value
        }
        if (value > max) {
          value = max
        } else if (value < min) {
          value = min
        }
        return value
      },
      [max, min]
    )
    const [value, setValue] = useState(initValue !== undefined ? getValue(initValue) : getValue(defaultValue))
    useClickOutside((e) => {
      setShowTooltip(false)
    }, document.querySelector(`#${prefixCls}`))

    useEffect(() => {
      if (initMax !== undefined && initMin !== undefined) {
        if (initMax < initMin) {
          setMax(initMin)
          setMin(initMax)
        }
      }
    }, [])

    useEffect(() => {
      setMax(initMax || 100)
    }, [initMax])

    useEffect(() => {
      setMin(initMin || 0)
    }, [initMin])

    // value 改变更新长度和位置
    useEffect(() => {
      const _value = initValue !== undefined ? getValue(initValue) : getValue(value)
      setNewRightPosition(getTrackWidth(_value))
      if (!isInitPage) {
        setShowTooltip(true)
      }
    }, [value, initValue])
    useEffect(() => {
      setIsInitPage(false)
    })
    useEffect(() => {
      setIsInitPage(true)
    }, [])

    useEffect(() => {
      // 每一份步长对应在父元素的百分比
      setPositionStep((step / (max - min)) * 100)
      // 设置初始位置
      setStartPosition(((value - min) / (max - min)) * 100)
    }, [max, min])

    // <- -> 键盘事件
    const onKeyDown = useCallback(
      (e) => {
        // home: 36 end: 35
        if (e.keyCode === 36) {
          e.preventDefault()
          setStartPosition(0)
          setValue(min)
          onChange(min)
        }
        if (e.keyCode === 35) {
          e.preventDefault()
          setStartPosition(100)
          setValue(max)
          onChange(max)
        }
        // 方向键
        if ([37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault()
          let _value = e.keyCode === 37 || e.keyCode === 38 ? value - step : value + step
          if (_value < min) {
            _value = min
          } else if (_value > max) {
            _value = max
          }
          setStartPosition(((_value - min) / (max - min)) * 100)
          if (initValue === undefined) {
            setValue(_value)
          }
          onChange(_value)
        }
      },
      [value, max, min]
    )

    useEffect(() => {
      if (initValue !== undefined) {
        const _value = getValue(initValue)
        setValue(_value)
      }
    }, [initValue])

    // 移动
    const onMouseMove = useCallback(
      (e) => {
        if (canMove) {
          setIsMove(true)
          const parent = sliderRef.current

          const {
            width: sliderWidth,
            height: sliderHeight,
            right: sliderRight,
            left: sliderLeft,
            top: sliderTop,
            bottom: sliderBottom
          } = parent.getBoundingClientRect()

          let diff = 0
          let changeValue = 0

          if (vertical) {
            diff = -Math.round((((e.clientY - startY) / sliderHeight) * 100) / positionStep) * positionStep
          } else {
            diff = Math.round((((e.clientX - startX) / sliderWidth) * 100) / positionStep) * positionStep
          }
          // 开始位置 + 偏移位置
          let position = startPosition + diff
          // 边界判断
          if (position <= 0) {
            position = 0
            if (vertical) {
              setStartY(sliderBottom)
            } else {
              setStartX(sliderLeft)
            }

            setStartPosition(position)
          } else if (position >= 100) {
            position = 100
            if (vertical) {
              setStartY(sliderTop)
            } else {
              setStartX(sliderRight)
            }

            setStartPosition(position)
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

          onChange(changeValue)
        }
      },
      [canMove, positionStep, startPosition, max, min]
    )
    const onMouseUp = useCallback(
      (e) => {
        e.stopPropagation()
        setLastTime(new Date().getTime())
        setStartPosition(newRightPosition)
        setCanMove(false)
        setIsMove(false)
      },
      [newRightPosition]
    )
    useEffect(() => {
      if (disabled) {
        return
      }
      if (canMove) {
        document.body.onmouseup = onMouseUp
        document.body.onmousemove = onMouseMove
      } else {
        document.body.onmouseup = null
        document.body.onmousemove = null
      }
    }, [canMove, disabled, onMouseUp, onMouseMove])

    // 获取 track 宽度
    const getTrackWidth = useCallback(
      (value) => {
        return ((value - min) / (max - min)) * 100
      },
      [value, max, min]
    )

    // 鼠标落下
    const onMouseDown = useCallback(
      (e) => {
        setFirstTime(new Date().getTime())
        if (disabled) {
          return
        }
        const { clientX, clientY } = e
        setCanMove(true)
        setIsMove(true)
        setStartPosition(getTrackWidth(value))
        if (vertical) {
          setStartY(clientY)
        } else {
          setStartX(clientX)
        }
      },
      [disabled, vertical, getTrackWidth]
    )

    // 鼠标移入展示tooltip
    const onMouseEnter = useCallback(() => {
      setShowTooltip(true)
    }, [value])

    // 点击滑块
    const onHandleClick = useCallback(
      (e) => {
        if (lastTime - firstTime < 200) {
          e.stopPropagation()
          setShowTooltip(true)
        }
      },
      [lastTime, firstTime]
    )

    // slider 点击
    const railClick = useCallback(
      (e) => {
        if (disabled) {
          return
        }

        const parent = sliderRef.current
        let diff = 0
        let position
        const { width: sliderWidth, height: sliderHeight, left } = parent.getBoundingClientRect()
        const { x, y } = tooltipRef.current.getBoundingClientRect()

        if (vertical) {
          diff = -Math.round((((e.clientY - y) / sliderHeight) * 100) / positionStep) * positionStep
          position = newRightPosition + diff
        } else {
          diff = Math.round((((e.clientX - x) / sliderWidth) * 100) / positionStep) * positionStep
          position = e.clientX <= left ? 0 : newRightPosition + diff
        }
        if (position <= 0) {
          position = 0
        } else if (position >= 100) {
          position = 100
        }
        const value = min + Math.round(((max - min) * position) / 100)
        if (initValue === undefined) {
          setValue(value)
        }
        setStartPosition(position)
        onChange(value)
      },
      [positionStep, newRightPosition, vertical, disabled, max, min]
    )
    // 点击marks上的点
    const onMarksClick = useCallback(
      (e, value) => {
        e.stopPropagation()
        if (initValue === undefined) {
          setValue(value)
          setStartPosition(((value - min) / (max - min)) * 100)
        }
        onChange(value)
      },
      [max, min]
    )
    const sliderClasses = classNames(prefixCls, `theme__${theme}`, {
      [`${prefixCls}--disabled`]: disabled,
      [`${prefixCls}--vertical`]: vertical,
      [`${prefixCls}--${type}`]: true
    })

    return (
      <div className={sliderClasses} ref={sliderRef} id={prefixCls}>
        <div className={`${prefixCls}__rail`} onClick={railClick} />
        <div
          className={`${prefixCls}__track`}
          style={{
            [!vertical ? 'width' : 'height']: `${newRightPosition.toFixed(4)}%`,
            [!vertical ? 'left' : 'bottom']: 0
          }}
          onClick={railClick}
        />
        <div
          className={classNames(`${prefixCls}__handle`)}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseLeave={() => {
            if (!isMove) {
              setShowTooltip(false)
            }
          }}
          ref={tooltipRef}
          onClick={onHandleClick}
          style={{
            [!vertical ? 'left' : 'top']: `${
              !vertical ? newRightPosition.toFixed(4) : (100 - newRightPosition).toFixed(4)
            }%`
          }}
          tabIndex="0"
          onKeyDown={onKeyDown}
          onBlur={(e) => {
            setShowTooltip(false)
          }}
        >
          <CSSTransition
            in={showTooltip}
            timeout={300}
            classNames={`${prefixCls}__tooltip`}
            className={`${prefixCls}__tooltip`}
          >
            <div
              style={{
                position: 'absolute',
                top: !vertical ? 0 : 5,
                left: !vertical ? 5 : 10,
                width: '100%'
              }}
            >
              <div className="hi-popper__container" style={{ left: 0, top: 0, zIndex: 1070 }}>
                <div
                  className={classNames('hi-tooltip__popper', 'hi-popper__content', {
                    [`hi-popper__content--${vertical ? 'right' : 'top'}`]: true
                  })}
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
          </CSSTransition>
        </div>
        <div className={`${prefixCls}__step`} onClick={railClick}>
          {Object.keys(marks).map((item, index) => (
            <span
              className={classNames(`${prefixCls}__step-dot`, {
                [`${prefixCls}__step-dotDisabled`]: value <= ((item - min) / (max - min)) * 100
              })}
              key={index}
              style={{
                [!vertical ? 'left' : 'bottom']: ((item - min) / (max - min)) * 100 + '%'
              }}
              onClick={(e) => onMarksClick(e, ((item - min) / (max - min)) * 100)}
            />
          ))}
        </div>
        {(showRangeLabel || Object.entries(marks).length !== 0) && (
          <div className={`${prefixCls}__stepText`}>
            {Object.keys(marks).length ? (
              Object.entries(marks).map(([key, item], index) => (
                <span
                  className={`${prefixCls}__stepText-dot`}
                  key={index}
                  style={{
                    [!vertical ? 'left' : 'bottom']: ((key - min) / (max - min)) * 100 + '%',
                    transform: !vertical ? 'translateX(-50%)' : 'translateY(50%)'
                  }}
                  onClick={(e) => {
                    onMarksClick(e, ((key - min) / (max - min)) * 100)
                  }}
                >
                  {item}
                </span>
              ))
            ) : (
              <>
                {min !== undefined && <span className={`${prefixCls}__min ${prefixCls}__stepText-dot`}>{min}</span>}
                {max !== undefined && <span className={`${prefixCls}__max ${prefixCls}__stepText-dot`}>{max}</span>}
              </>
            )}
          </div>
        )}
      </div>
    )
  }
)
export default Provider(Slider)
