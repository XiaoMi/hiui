import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { invariant } from '@hi-ui/env'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { useToggle } from '@hi-ui/use-toggle'
import { getPrefixStyleVar } from '@hi-ui/classname'
import { setAttrStatus } from '@hi-ui/dom-utils'
import { TooltipHelpers } from '@hi-ui/tooltip'

export const useSlider = (
  {
    value: valueProp,
    onChange,
    defaultValue,
    min: minProp = 0,
    max: maxProp = 100,
    step = 1,
    vertical = false,
    disabled = false,
    reversed = false,
    range = false,
    color,
    ...rest
  }: UseSliderProps,
  tooltipRefs: React.MutableRefObject<TooltipHelpers | null>[]
) => {
  /**
   * 边界优化
   */
  const [min, max, rangeLength] = useMemo(() => {
    if (maxProp < minProp) {
      invariant(false, 'The max must large than min.')

      return [maxProp, minProp, minProp - maxProp]
    }
    return [minProp, maxProp, maxProp - minProp]
  }, [maxProp, minProp])

  // 根据 range 模式设置默认值
  const initialDefaultValue = useMemo(() => {
    if (defaultValue !== undefined) return defaultValue
    return range ? ([min, max] as [number, number]) : 0
  }, [defaultValue, range, min, max])

  // 内部状态管理 - 支持滑块交叉
  const [internalValue, setInternalValue] = useState(() => valueProp ?? initialDefaultValue)

  // 记录是否正在拖动
  const isDraggingRef = useRef(false)

  // 使用内部状态，只在非拖动状态下同步外部 value
  useEffect(() => {
    if (!isDraggingRef.current && valueProp !== undefined) {
      setInternalValue(valueProp)
    }
  }, [valueProp])

  const value = internalValue

  // 手动处理值更新
  const tryChangeValue = useCallback(
    (nextValue: number | [number, number]) => {
      // 更新内部状态
      setInternalValue(nextValue)

      // 调用外部 onChange，范围模式下返回排序后的值
      if (onChange) {
        if (range && Array.isArray(nextValue)) {
          const sortedValue: [number, number] = [
            Math.min(nextValue[0], nextValue[1]),
            Math.max(nextValue[0], nextValue[1]),
          ]
          onChange(sortedValue)
        } else {
          onChange(nextValue)
        }
      }
    },
    [onChange, range]
  )

  /**
   * 统一拦截处理值边界
   */
  const proxyTryChangeValue = useCallback(
    (nextValue: number | [number, number]) => {
      if (disabled) return

      if (Array.isArray(nextValue)) {
        const [val0, val1] = nextValue
        const clampedVal0 = Math.max(min, Math.min(val0, max))
        const clampedVal1 = Math.max(min, Math.min(val1, max))
        tryChangeValue([clampedVal0, clampedVal1])
      } else {
        if (nextValue > max) {
          nextValue = max
        } else if (nextValue < min) {
          nextValue = min
        }
        tryChangeValue(nextValue)
      }
    },
    [disabled, max, min, tryChangeValue]
  )

  const [firstTime, setFirstTime] = useState(0)
  const [lastTime, setLastTime] = useState(0)
  const [inMoving, setInMoving] = useState(false)
  // 跟踪当前拖动的滑块索引，范围模式下使用：0 表示起始滑块，1 表示结束滑块
  const [activeHandleIndex, setActiveHandleIndex] = useState<number>(0)

  const [tooltipVisible, tooltipVisibleAction] = useToggle()

  const sliderRef = useRef<HTMLDivElement>(null)

  const handleElementRef = useRef<HTMLDivElement>(null)
  const handleElementRef2 = useRef<HTMLDivElement>(null)

  /**
   * 计算 track 滑动长度占总 Slider 长度占比
   */
  const getTrackPercent = useCallback(
    (value) => {
      const percent = ((value - min) / rangeLength) * 100
      return Math.max(Math.min(percent, 100), 0)
    },
    [rangeLength, min]
  )

  const rangePositions = useMemo(() => {
    if (range && Array.isArray(value)) {
      const pos0 = getTrackPercent(value[0])
      const pos1 = getTrackPercent(value[1])
      // 不管滑块相对位置如何，轨道始终显示在两个滑块之间
      return {
        start: Math.min(pos0, pos1),
        end: Math.max(pos0, pos1),
        handle0Pos: pos0,
        handle1Pos: pos1,
      }
    }
    return null
  }, [range, value, getTrackPercent])

  const currentPositionOffset = useMemo(() => {
    if (range && Array.isArray(value)) {
      return rangePositions?.start || 0
    }
    return getTrackPercent(value as number)
  }, [value, getTrackPercent, range, rangePositions])

  /**
   * 点击滑块
   */
  const onHandleClick = useCallback(
    (evt) => {
      // TODO: Remove, using tooltip
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
        if (range && Array.isArray(value)) {
          // 范围模式：根据当前激活的滑块更新相应的值
          const newValue: [number, number] = [...value]
          newValue[activeHandleIndex] = nextValue
          proxyTryChangeValue(newValue)
        } else {
          proxyTryChangeValue(nextValue)
        }
      }
    },
    [getValueInDrag, proxyTryChangeValue, range, value, activeHandleIndex]
  )

  /**
   * 手指按下 handle，触发拖动
   */
  const onDragStart = useCallback(
    (evt, handleIndex: number = 0) => {
      setFirstTime(Date.now())

      if (disabled) return

      setInMoving(true)
      setActiveHandleIndex(handleIndex)
      isDraggingRef.current = true // AIGC: 标记开始拖动

      // 点击 handler 滑动器时保持值不变，不触发修改
      const isHandle1 = handleElementRef.current && handleElementRef.current.contains(evt.target)
      const isHandle2 = handleElementRef2.current && handleElementRef2.current.contains(evt.target)

      if (!isHandle1 && !isHandle2) {
        // 点击轨道：在范围模式下，判断应该移动哪个滑块
        if (range && Array.isArray(value)) {
          const nextValue = getValueInDrag(evt)
          if (nextValue != null) {
            const [start, end] = value
            const distToStart = Math.abs(nextValue - start)
            const distToEnd = Math.abs(nextValue - end)
            const closerIndex = distToStart <= distToEnd ? 0 : 1
            setActiveHandleIndex(closerIndex)
            const newValue: [number, number] = [...value]
            newValue[closerIndex] = nextValue
            proxyTryChangeValue(newValue)
          }
        } else {
          setValueByDrag(evt)
        }
      }
    },
    [disabled, setValueByDrag, range, value, getValueInDrag, proxyTryChangeValue]
  )

  // 手指控制滑块移动
  const onDragMove = useCallback(
    (evt) => {
      if (inMoving) {
        setValueByDrag(evt)
        // 拖动过程中实时更新 tooltip 显示位置
        if (activeHandleIndex === 0) {
          tooltipRefs[0].current?.update()
        } else if (activeHandleIndex === 1) {
          tooltipRefs[1].current?.update()
        }
      }
    },
    [activeHandleIndex, inMoving, setValueByDrag, tooltipRefs]
  )

  /**
   * 手指松开 handle，停止拖动
   */
  const onDragEnd = useCallback(
    (evt) => {
      if (!inMoving) return
      evt.stopPropagation()
      setLastTime(Date.now())
      setInMoving(false)
      isDraggingRef.current = false
    },
    [inMoving]
  )

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
    (evt, handleIndex: number = 0) => {
      const { keyCode } = evt
      let nextValue
      const currentValue = range && Array.isArray(value) ? value[handleIndex] : (value as number)

      switch (keyCode) {
        // home
        case 36:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = min
          if (range && Array.isArray(value)) {
            const newValue: [number, number] = [...value]
            newValue[handleIndex] = nextValue
            proxyTryChangeValue(newValue)
          } else {
            proxyTryChangeValue(nextValue)
          }
          break
        case 35:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = max
          if (range && Array.isArray(value)) {
            const newValue: [number, number] = [...value]
            newValue[handleIndex] = nextValue
            proxyTryChangeValue(newValue)
          } else {
            proxyTryChangeValue(nextValue)
          }
          break

        case 37:
        case 38:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = currentValue - step
          if (range && Array.isArray(value)) {
            const newValue: [number, number] = [...value]
            newValue[handleIndex] = nextValue
            proxyTryChangeValue(newValue)
          } else {
            proxyTryChangeValue(nextValue)
          }
          break
        case 39:
        case 40:
          evt.preventDefault()
          evt.stopPropagation()

          nextValue = currentValue + step
          if (range && Array.isArray(value)) {
            const newValue: [number, number] = [...value]
            newValue[handleIndex] = nextValue
            proxyTryChangeValue(newValue)
          } else {
            proxyTryChangeValue(nextValue)
          }
          break
      }
    },
    [value, max, min, proxyTryChangeValue, step, range]
  )

  /**
   * 对 tooltip 的处理
   */
  useOutsideClick(sliderRef, (e) => {
    if (tooltipVisible) {
      tooltipVisibleAction.off()
    }
  })

  const getHandleProps = useCallback(
    (handleIndex: number = 0) => {
      const style: React.CSSProperties = {
        position: 'absolute',
        userSelect: 'none',
        touchAction: 'none',
      }

      let offset = currentPositionOffset
      if (range && rangePositions) {
        // 使用实际的滑块位置，而不是排序后的位置
        offset = handleIndex === 0 ? rangePositions.handle0Pos : rangePositions.handle1Pos
      }

      if (vertical) {
        const value = reversed ? `${offset}%` : `${100 - offset}%`
        style.top = value
      } else {
        const value = reversed ? `${100 - offset}%` : `${offset}%`
        style.left = value
      }

      return {
        ref: handleIndex === 0 ? handleElementRef : handleElementRef2,
        style,
        onMouseEnter,
        onMouseLeave,
        onClick: onHandleClick,
        tabIndex: 0,
        onKeyDown: (evt: React.KeyboardEvent) => onKeyDown(evt, handleIndex),
        onBlur,
        onPointerDown: (evt: React.PointerEvent) => {
          evt.stopPropagation()
          setActiveHandleIndex(handleIndex)
          onDragStart(evt, handleIndex)
        },
      }
    },
    [
      onMouseEnter,
      onMouseLeave,
      onHandleClick,
      onKeyDown,
      currentPositionOffset,
      vertical,
      onBlur,
      reversed,
      range,
      rangePositions,
      onDragStart,
    ]
  )

  const getRailProps = useCallback(() => {
    const style: React.CSSProperties = {
      position: 'absolute',
      [vertical ? 'height' : 'width']: '100%',
    }

    return {
      style,
    }
  }, [vertical])

  const getTrackProps = useCallback(() => {
    const verticalAttr = reversed ? 'top' : 'bottom'
    const horizontalAttr = reversed ? 'right' : 'left'

    const style: React.CSSProperties = {
      position: 'absolute',
    }

    if (range && rangePositions) {
      // 范围模式：轨道从 start 到 end
      const trackLength = rangePositions.end - rangePositions.start
      style[vertical ? 'height' : 'width'] = `${trackLength}%`

      if (vertical) {
        // 垂直模式：bottom 从 rangePositions.start 开始
        style[reversed ? 'top' : 'bottom'] = `${rangePositions.start}%`
      } else {
        // 水平模式：left 从 rangePositions.start 开始
        style[reversed ? 'right' : 'left'] = `${
          reversed ? 100 - rangePositions.end : rangePositions.start
        }%`
      }
    } else {
      // 单值模式：轨道从起点到当前位置
      style[vertical ? 'height' : 'width'] = `${currentPositionOffset}%`
      style[vertical ? verticalAttr : horizontalAttr] = 0
    }

    return {
      style,
    }
  }, [vertical, currentPositionOffset, reversed, range, rangePositions])

  const getMarkProps = useCallback(
    (props) => {
      const dotValue = ((props.value - min) / rangeLength) * 100

      const attr = vertical ? 'bottom' : 'left'
      const attrValue = reversed ? `${100 - dotValue}%` : `${dotValue}%`

      // 判断 mark 是否被选中
      let isChecked = false
      if (range && Array.isArray(value)) {
        const percentValue = ((props.value - min) / rangeLength) * 100
        const [startPercent, endPercent] = [
          ((value[0] - min) / rangeLength) * 100,
          ((value[1] - min) / rangeLength) * 100,
        ]
        isChecked = percentValue >= startPercent && percentValue <= endPercent
      } else {
        isChecked = dotValue <= getTrackPercent(value as number)
      }

      return {
        style: {
          [attr]: attrValue,
        },
        'data-checked': setAttrStatus(isChecked),
        onClick: (evt: React.MouseEvent) => {
          onMarkClick(evt, dotValue)
        },
      }
    },
    [onMarkClick, vertical, min, rangeLength, value, reversed, range, getTrackPercent]
  )

  const getMarkLabelProps = useCallback(
    (props) => {
      const value = ((props.value - min) / rangeLength) * 100

      const attr = vertical ? 'bottom' : 'left'
      const attrValue = reversed ? `${100 - value}%` : `${value}%`

      return {
        style: {
          [attr]: attrValue,
          transform: !vertical ? 'translateX(-50%)' : 'translateY(50%)',
        },
        onClick: (evt: React.MouseEvent) => {
          onMarkClick(evt, value)
        },
        children: props.content,
      }
    },
    [onMarkClick, vertical, min, rangeLength, reversed]
  )

  const rootProps = {
    ...rest,
    style: {
      // @ts-ignore
      ...rest.style,
      position: 'relative',
      userSelect: 'none',
      touchAction: 'none',
      outline: 0,
      [getPrefixStyleVar('slider-color')]: color,
    } as React.CSSProperties,
    ref: sliderRef,
    // 指定某个 slider 被点击时触发，不能挂载到全局
    onPointerDown: (evt: React.PointerEvent) => onDragStart(evt, 0),
  }

  return {
    value,
    min,
    max,
    vertical,
    disabled,
    tooltipVisible,
    range,
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
  defaultValue?: number | [number, number]
  /**
   * 设置当前值（受控）
   */
  value?: number | [number, number]
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
   * 自定义颜色
   */
  color?: string
  /**
   * 是否为范围选择
   */
  range?: boolean
  /**
   * 当 Slider 的值发生改变时触发，value 为变化后的值
   */
  onChange?: (value: number | [number, number]) => void
}

export type UseSliderReturn = ReturnType<typeof useSlider>
