import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { __DEV__ } from '@hi-ui/env'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { useToggle } from '@hi-ui/use-toggle'

export const useSlider = ({
  value: valueProp,
  onChange,
  defaultValue = 0,
  min: minProp = 0,
  max: maxProp = 100,
  step = 0,
  vertical = false,
  disabled = false,
  tipFormatter,
  marks = {},
  showRangeLabel = false,
  reversed = false,
  ...rest
}: UseSliderProps) => {
  /**
   * 边界优化
   */
  const [min, max, rangeLength] = useMemo(() => {
    if (maxProp < minProp) {
      if (__DEV__) {
        console.info('Warning: the max must large than min.')
      }
      return [maxProp, minProp, minProp - maxProp]
    }
    return [minProp, maxProp, maxProp - minProp]
  }, [maxProp, minProp])

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange, Object.is)

  /**
   * 统一拦截处理值边界
   */
  const proxyTryChangeValue = useCallback(
    (nextValue: number) => {
      if (disabled) return

      if (nextValue > max) {
        nextValue = max
      } else if (nextValue < min) {
        nextValue = min
      }

      tryChangeValue(nextValue)
    },
    [disabled, max, min, tryChangeValue]
  )

  const [firstTime, setFirstTime] = useState(0)
  const [lastTime, setLastTime] = useState(0)
  const [inMoving, setInMoving] = useState(false)

  const [tooltipVisible, tooltipVisibleAction] = useToggle()

  const sliderRef = useRef<HTMLDivElement>(null)
  const handleElRef = useRef<HTMLDivElement>(null)

  /**
   * 计算 track 滑动长度占总 Slider 长度占比
   */
  const getTrackPercent = useCallback(
    (value) => {
      return ((value - min) / rangeLength) * 100
    },
    [rangeLength, min]
  )

  const currentPositionOffset = useMemo(() => getTrackPercent(value), [value, getTrackPercent])

  /**
   * 点击滑块
   */
  const onHandleClick = useCallback(
    (evt) => {
      // TODO: Remove
      if (lastTime - firstTime < 200) {
        evt.stopPropagation()
        tooltipVisibleAction.on()
      }
    },
    [lastTime, firstTime, tooltipVisibleAction]
  )

  /**
   * 鼠标移入展示 tooltip
   */
  const onMouseEnter = useCallback(() => {
    tooltipVisibleAction.on()
  }, [tooltipVisibleAction])

  /**
   * 鼠标移出隐藏 tooltip
   */
  const onMouseLeave = useCallback(
    (evt) => {
      // 拖拽滑动中不隐藏 tooltip，保证值跟随显示
      if (inMoving) return
      tooltipVisibleAction.off()
    },
    [inMoving, tooltipVisibleAction]
  )

  /**
   * 失焦时隐藏
   */
  const onBlur = useCallback(
    (evt) => {
      tooltipVisibleAction.off()
    },
    [tooltipVisibleAction]
  )

  /**
   * 位置计算始终相对于起始点为 slider 的边界，保证相对唯一坐标系原则
   */
  const getValueInDrag = useCallback(
    (evt) => {
      if (disabled) return
      const sliderElement = sliderRef.current

      if (!sliderElement) return

      const {
        width: sliderWidth,
        height: sliderHeight,
        left: startX,
        bottom: startY,
      } = sliderElement.getBoundingClientRect()

      const { clientX, clientY } = evt.touches?.[0] ?? evt

      const diffToRailStart = vertical ? startY - clientY : clientX - startX
      const railLength = vertical ? sliderHeight : sliderWidth

      let percent = diffToRailStart / railLength
      if (reversed) {
        percent = 1 - percent
      }

      const nextTrackLength = rangeLength * percent
      let nextValue = nextTrackLength + min

      if (step) {
        // 如果是小数，最终数值就精确到小数位数，比如 `step=0.1`，最终数值就精确到 `0.1`
        nextValue = Math.round(nextTrackLength / step) * step + min
      }

      return nextValue
    },
    [rangeLength, min, disabled, step, reversed, vertical]
  )

  /**
   * 设置值
   */
  const setValueByDrag = useCallback(
    (evt) => {
      const nextValue = getValueInDrag(evt)
      if (nextValue != null) {
        proxyTryChangeValue(nextValue)
      }
    },
    [getValueInDrag, proxyTryChangeValue]
  )

  /**
   * 手指按下 handle，触发拖动
   */
  const onDragStart = useCallback(
    (evt) => {
      setFirstTime(Date.now())

      if (disabled) return

      // const { clientX, clientY } = evt

      setInMoving(true)

      setValueByDrag(evt)
    },
    [disabled, setValueByDrag]
  )

  // 手指控制滑块移动
  const onDragMove = useCallback(
    (evt) => {
      if (inMoving) {
        setValueByDrag(evt)
      }
    },
    [inMoving, setValueByDrag]
  )

  /**
   * 手指松开 handle，停止拖动
   */
  const onDragEnd = useCallback((evt) => {
    evt.stopPropagation()
    setLastTime(Date.now())
    setInMoving(false)
  }, [])

  useEffect(() => {
    if (disabled) return

    if (inMoving) {
      document.body.onmouseup = onDragEnd
      document.body.onmousemove = onDragMove
    } else {
      document.body.onmouseup = null
      document.body.onmousemove = null
    }
  }, [inMoving, disabled, onDragEnd, onDragMove])

  /**
   * mark 的点被点击时触发
   */
  const onMarkClick = useCallback(
    (evt, value) => {
      evt.stopPropagation()

      proxyTryChangeValue(value)
    },
    [proxyTryChangeValue]
  )

  /**
   * 键盘事件
   */
  const onKeyDown = useCallback(
    (evt) => {
      const { keyCode } = evt
      let nextValue
      switch (keyCode) {
        // home
        case 36:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = min
          proxyTryChangeValue(nextValue)
          break
        case 35:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = max
          proxyTryChangeValue(nextValue)
          break

        case 37:
        case 38:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = value - step
          proxyTryChangeValue(nextValue)
          break
        case 39:
        case 40:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = value + step
          proxyTryChangeValue(nextValue)
          break
      }
    },
    [value, max, min, proxyTryChangeValue, step]
  )

  // const [didMount, setDidMount] = useState(false)

  // useEffect(() => {
  //   setDidMount(true)
  // }, [])

  /**
   * 对 tooltip 的处理
   */
  useOutsideClick(sliderRef, (e) => {
    if (tooltipVisible) {
      tooltipVisibleAction.off()
    }
  })

  const getHandleProps = useCallback(() => {
    const style: React.CSSProperties = {
      position: 'absolute',
      userSelect: 'none',
      touchAction: 'none',
    }

    // TODO: 如何只测量 DOM 一次盒尺寸，现在是每次渲染都会拿取
    if (vertical) {
      const handleHeight = handleElRef.current?.getBoundingClientRect?.().height ?? 0
      style.top = `calc(${100 - currentPositionOffset}% - ${handleHeight / 2}px)`
    } else {
      const handleWidth = handleElRef.current?.getBoundingClientRect?.().width ?? 0
      style.left = `calc(${currentPositionOffset}% - ${handleWidth / 2}px)`
    }

    return {
      ref: handleElRef,
      style,
      // onMouseDown: onDragStart,
      onMouseEnter,
      onMouseLeave,
      onClick: onHandleClick,
      tabIndex: 0,
      onKeyDown,
      onBlur,
    }
  }, [
    // onDragStart,
    onMouseEnter,
    onMouseLeave,
    onHandleClick,
    onKeyDown,
    currentPositionOffset,
    vertical,
    onBlur,
  ])

  const getRailProps = useCallback(() => {
    const style: React.CSSProperties = {
      width: '100%',
      position: 'absolute',
    }

    return {
      style,
    }
  }, [])

  const getTrackProps = useCallback(() => {
    const style: React.CSSProperties = {
      position: 'absolute',
      [vertical ? 'height' : 'width']: `${currentPositionOffset}%`,
      [vertical ? 'bottom' : 'left']: 0,
    }

    return {
      style,
    }
  }, [vertical, currentPositionOffset])

  const getMarkProps = useCallback(
    (props) => {
      const value = ((props.value - min) / rangeLength) * 100
      return {
        style: {
          [!vertical ? 'left' : 'bottom']: value + '%',
        },
        onClick: (evt: React.MouseEvent) => {
          onMarkClick(evt, value)
        },
      }
    },
    [onMarkClick, vertical, min, rangeLength]
  )

  const getMarkLabelProps = useCallback(
    (props) => {
      const value = ((props.value - min) / rangeLength) * 100

      return {
        style: {
          [!vertical ? 'left' : 'bottom']: value + '%',
          transform: !vertical ? 'translateX(-50%)' : 'translateY(50%)',
        },
        onClick: (evt: React.MouseEvent) => {
          onMarkClick(evt, value)
        },
        children: props.content,
      }
    },
    [onMarkClick, vertical, min, rangeLength]
  )

  const rootProps = {
    ...rest,
    style: {
      position: 'relative',
      userSelect: 'none',
      touchAction: 'none',
      outline: 0,
    } as React.CSSProperties,
    ref: sliderRef,
    // 指定某个 slider 被点击时触发，不能挂载到全局
    onPointerDown: onDragStart,
  }

  return {
    rootProps: rootProps,
    getHandleProps,
    getRailProps,
    getTrackProps,
    getMarkLabelProps,
    getMarkProps,
  }
}

export interface UseSliderProps {
  /**
   * 设置初始默认值
   */
  defaultValue?: number
  /**
   * 设置当前值（受控）
   */
  value?: number
  /**
   * 最小值
   */
  min?: number
  /**
   * 最大值
   */
  max?: number
  /**
   * 开启禁用状态
   */
  disabled?: boolean
  /**
   * 是否显示范围label
   */
  showRangeLabel?: boolean
  /**
   * 自定义 Tooltip 中显示文案
   */
  tipFormatter?: (value: number) => React.ReactNode
  /**
   * 刻度标记，key 的类型必须为 number，且取值在闭区间 [min, max] 内
   */
  marks?: Record<number, any>
  /**
   * 步长
   */
  step?: number
  /**
   * 值为 true 时，Slider 为垂直方向
   */
  vertical?: boolean
  /**
   * 开启反转
   */
  reversed?: boolean
  /**
   * 当 Slider 的值发生改变时触发，value 为变化后的值
   */
  onChange?: (value: number) => void
}

export type UseSliderReturn = ReturnType<typeof useSlider>
