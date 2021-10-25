import React, { forwardRef, useRef, useCallback, useState, useMemo, useLayoutEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CloseCircleFilled, CloseOutlined } from '@hi-ui/icons'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { TagInputOption } from './types'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import { isFunction } from '@hi-ui/type-assertion'
import ResizeDetector, { useResizeDetector } from 'react-resize-detector'

const _role = 'tag-input'
const _prefix = getPrefixCls(_role)
const NOOP_ARRAY = [] as []

/**
 * TODO: What is TagInputMock
 */
export const TagInputMock = forwardRef<HTMLDivElement | null, TagInputMockProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      defaultValue = NOOP_ARRAY,
      value: valueProp,
      onChange,
      placeholder,
      data = NOOP_ARRAY,
      clearable = false,
      disabled = false,
      suffix,
      tagWidth = 20,
      maxCount,
      displayRender,
      onMouseOver,
      onMouseLeave,
      onClear,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const tagList = useMemo(
      () => value.map((id) => data.find((item) => item.id === id) || { id, title: id }),
      [value, data]
    )

    const tagInputRef = useRef<HTMLDivElement>(null)
    const containerWidth = tagInputRef.current ? tagInputRef.current.clientWidth : 0

    const mergedTagList = useMemo(() => {
      let items = tagList

      if (typeof maxCount === 'number') {
        items = tagList.slice(0, maxCount)
      } else {
        items = tagList.slice(0, Math.min(tagList.length, containerWidth / tagWidth))
      }

      return items
    }, [tagList, tagWidth, containerWidth, maxCount])

    console.log('mergedTagList', mergedTagList, containerWidth)

    const tagCount = tagList.length
    const hasTags = tagCount > 0

    const [tagsWidth, setTagsWidth] = useState<any>({})
    const getTagWidth = useCallback(
      (index: number) => {
        return (typeof tagList[index] !== 'undefined' && tagsWidth[tagList[index].id]) || 0
      },
      [tagsWidth, tagList]
    )

    const [suffixWidth, setSuffixWidth] = useState(0)
    console.log('tagsWidth', tagsWidth, suffixWidth)

    const [tagMaxWidth, setTagMaxWidth] = useState(0)
    const [tagMaxCount, setTagMaxCount] = useState(0)
    console.log(tagMaxCount)

    useLayoutEffect(() => {
      if (tagList && tagList.length > 0) {
        let totalWidth = suffixWidth
        const len = tagList.length
        const lastIndex = len - 1

        for (let i = 0; i < len; i += 1) {
          const currentTagWidth = getTagWidth(i)

          if (currentTagWidth === undefined) {
            setTagMaxCount(i - 1)
            break
          }

          totalWidth += currentTagWidth

          if (
            (lastIndex === 0 && totalWidth <= containerWidth) ||
            (i === lastIndex - 1 && totalWidth + getTagWidth(lastIndex)! <= containerWidth)
          ) {
            setTagMaxCount(lastIndex)
            break
          } else if (totalWidth + 20 > containerWidth) {
            setTagMaxCount(i - 1)
            break
          }
        }
      } else {
        setTagMaxCount(0)
      }
    }, [tagsWidth, suffixWidth, getTagWidth, containerWidth, tagList, suffix])

    const onClearLatest = useLatestCallback(onClear)
    const handleClear = useCallback(
      (evt) => {
        if (disabled) return

        evt.stopPropagation()
        tryChangeValue(NOOP_ARRAY)
        onClearLatest()
      },
      [tryChangeValue, disabled, onClearLatest]
    )

    const [hover, setHover] = useState(false)
    const trySetHover = useCallback(
      (hovered: boolean) => {
        if (disabled) return
        setHover(hovered)
      },
      [disabled]
    )

    // 在开启 clearable 下展示 清除内容按钮，可点击进行内容清楚
    const showClearableIcon = clearable && hasTags && !disabled

    const cls = cx(prefixCls, className)

    return (
      <div
        ref={useMergeRefs(ref, tagInputRef)}
        role={role}
        className={cls}
        onMouseOver={(evt) => {
          trySetHover(true)
          onMouseOver?.(evt)
        }}
        onMouseLeave={(evt) => {
          trySetHover(false)
          onMouseLeave?.(evt)
        }}
        {...rest}
      >
        <div className={cx(`${prefixCls}__container`, disabled && 'disabled')}>
          {/* tags 列表区域渲染 */}
          {hasTags ? (
            <span className={`${prefixCls}__value`}>
              <span className={`${prefixCls}__tags`}>
                {tagList.map((option, index) => {
                  return (
                    <MockTag
                      style={
                        index < tagMaxCount
                          ? {}
                          : { opacity: 0, width: 0, height: 0, overflow: 'hidden' }
                      }
                      key={option.id}
                      prefixCls={prefixCls}
                      disabled={disabled}
                      option={option}
                      value={value}
                      displayRender={displayRender}
                      tryChangeValue={tryChangeValue}
                      onTagResize={(id, w) => setTagsWidth((prev) => ({ ...prev, [id]: w }))}
                    />
                  )
                })}
              </span>
            </span>
          ) : (
            <span className={`${prefixCls}__placeholder`}>{placeholder}</span>
          )}

          <ResizeDetector onResize={(w = 0) => setSuffixWidth(w)}>
            {/* suffix 后缀区域渲染 */}
            {!!suffix || (showClearableIcon && hover) || hasTags ? (
              <span className={`${prefixCls}__suffix`}>
                {hasTags ? (
                  <span className={cx(`${prefixCls}__tag--total`)}>
                    {`${tagCount > 99 ? '99+' : tagCount}`}
                  </span>
                ) : showClearableIcon && hover ? (
                  <span
                    className={`${prefixCls}__clear`}
                    role="button"
                    tabIndex={-1}
                    onClick={handleClear}
                  >
                    <CloseCircleFilled />
                  </span>
                ) : null}
                {suffix}
              </span>
            ) : null}
          </ResizeDetector>
        </div>
      </div>
    )
  }
)

export interface TagInputMockProps
  extends Omit<HiBaseHTMLProps<'div'>, 'defaultValue' | 'onChange' | 'value'> {
  /**
   * 设置当前多选值
   */
  value?: React.ReactText[]
  /**
   * 设置当前多选值默认值
   */
  defaultValue?: React.ReactText[]
  /**
   * 多选值改变时的回调
   */
  onChange?: (values: React.ReactText[]) => void
  /**
   * 是否可清空	boolean	true | false	true
   */
  clearable?: boolean
  /**
   * 是否禁止使用	boolean	true | false	false
   */
  disabled?: boolean
  /**
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (checkedOption: TagInputOption) => React.ReactNode
  /**
   * 输入框占位符
   */
  placeholder?: string
  /**
   * 输入框后置内容
   */
  suffix?: React.ReactNode
  /**
   * tag 列表数据源
   */
  data?: TagInputOption[]
  /**
   * 点击清空 tags 回调
   */
  onClear?: () => void
}

if (__DEV__) {
  TagInputMock.displayName = 'TagInputMock'
}

function MockTag({
  prefixCls,
  option,
  disabled,
  value,
  onTagResize,
  tryChangeValue,
  displayRender,
  ...rest
}: any) {
  const { ref } = useResizeDetector({
    onResize: (width = 0) => {
      onTagResize(option.id, width + 16)
    },
  })

  const title = isFunction(displayRender) ? displayRender(option) : true
  const closeable = !option.disabled

  return (
    <span ref={ref} className={`${prefixCls}__tag`} key={option.id} {...rest}>
      <span className={`${prefixCls}__tag-content`}>{title === true ? option.title : title}</span>
      {closeable ? (
        <span
          className={`${prefixCls}__tag-closed`}
          onClick={(evt) => {
            if (disabled) return

            evt.stopPropagation()
            const nextValue = value.filter((id: any) => id !== option.id)
            tryChangeValue(nextValue)
          }}
        >
          <CloseOutlined />
        </span>
      ) : null}
    </span>
  )
}
