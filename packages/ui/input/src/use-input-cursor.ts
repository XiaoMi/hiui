import React, { MutableRefObject, useCallback, useRef, useState } from 'react'
import { isNullish } from '@hi-ui/type-assertion'

const defaultSeparator = ' '

export const useInputCursor = ({
  inputElementRef,
  value,
  formatter,
  separator = defaultSeparator,
}: UseInputCursorProps) => {
  const [position, setPosition] = useState<number>(0)

  const startPositionRef = useRef<number>(0)

  // 记录值变化前的位置
  const handleOnKeyDown = useCallback(() => {
    startPositionRef.current = inputElementRef.current?.selectionStart ?? 0
  }, [inputElementRef])

  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (isNullish(value)) {
        return
      }

      const val = evt.target.value

      // 处理后的字符串
      const str = typeof formatter === 'function' ? formatter(val) : val
      // 光标变化后的位置
      const endPosition = inputElementRef.current?.selectionStart ?? 0

      // 字符串添加
      if (str.length > value.length) {
        // 值变化的长度
        const len = str.length - value.length
        // 取出变化的值
        const addStr = str.substring(startPositionRef.current, startPositionRef.current + len)
        // 光标应该移动的格数
        const step = getSeparatorNum(addStr, separator)

        setPosition(endPosition + step)
      }

      // 字符串删除
      if (str.length < value.length) {
        if (str.charAt(endPosition - 1) === separator) {
          setPosition(endPosition - 1)
        } else {
          setPosition(endPosition)
        }
      }

      // 没有变化
      if (str.length === value.length) {
        if (str.charAt(startPositionRef.current) === separator) {
          setPosition(endPosition + 1)
        } else {
          setPosition(endPosition)
        }
      }
    },
    [formatter, inputElementRef, separator, value]
  )

  return {
    position,
    handleChange,
    handleOnKeyDown,
  }
}

export interface UseInputCursorProps {
  /**
   * 输入框 ref
   */
  inputElementRef: MutableRefObject<HTMLInputElement | null>
  /**
   * 输入框变化前的值
   */
  value: string
  /**
   * 格式化处理函数
   * @param args
   * @returns
   */
  formatter?: (...args: any[]) => string
  /**
   * 间隔符
   */
  separator?: string
}

export type useFormatReturn = ReturnType<typeof useInputCursor>

/**
 * 获取字符串中有多少格式化字符
 * @param str
 * @returns
 */
const getSeparatorNum = (str: string, separator: string = defaultSeparator) => {
  let index = str.indexOf(separator)
  let num = 0

  while (index !== -1) {
    index = str.indexOf(separator, index + 1)
    num++
  }

  return num
}
