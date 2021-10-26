import React, { forwardRef, useCallback, useState, useMemo, useLayoutEffect } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CloseCircleFilled, CloseOutlined } from '@hi-ui/icons'
import { TagInputOption } from './types'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { useLatestCallback } from '@hi-ui/use-latest'
import { isArrayNonEmpty, isFunction } from '@hi-ui/type-assertion'
import ResizeDetector from 'react-resize-detector'

const _role = 'tag-input-mock'
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

    const [containerWidth = 0, setContainerWidth] = useState<number>()

    const mergedTagList = useMemo(() => {
      return tagList.slice(0, Math.min(tagList.length, containerWidth / tagWidth))
    }, [tagList, tagWidth, containerWidth])

    const tagCount = tagList.length
    const hasTags = tagCount > 0

    const [tagsWidth, setTagsWidth] = useState<{ [key: string]: number }>({})
    const getTagWidth = useCallback(
      (index: number) => {
        return (typeof tagList[index] !== 'undefined' && tagsWidth[tagList[index].id]) || 0
      },
      [tagsWidth, tagList]
    )

    const [suffixWidth, setSuffixWidth] = useState(0)
    console.log('tagsWidth', tagsWidth, suffixWidth)

    // const [tagMaxWidth, setTagMaxWidth] = useState(0)
    const [tagMaxCount, setTagMaxCount] = useState(0)
    console.log(tagMaxCount)

    useLayoutEffect(() => {
      if (isArrayNonEmpty(tagList)) {
        const len = tagList.length
        const lastIndex = len - 1
        let totalWidth = suffixWidth

        for (let i = 0; i < len; ++i) {
          const currentTagWidth = getTagWidth(i)

          if (currentTagWidth === undefined) {
            break
          }

          totalWidth += currentTagWidth

          if (
            (lastIndex === 0 && totalWidth <= containerWidth) ||
            (i === lastIndex - 1 && totalWidth + getTagWidth(lastIndex) <= containerWidth)
          ) {
            setTagMaxCount(lastIndex)
            break
          } else if (totalWidth > containerWidth) {
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
        ref={ref}
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
        <ResizeDetector
          skipOnMount={false}
          onResize={(w) => {
            if (w) {
              setContainerWidth(w)
            }
          }}
        >
          <div className={cx(`${prefixCls}__container`, disabled && 'disabled')}>
            {/* tags 列表区域渲染 */}
            {hasTags ? (
              <span className={`${prefixCls}__tags`}>
                {mergedTagList.map((option, index) => {
                  return (
                    <MockTag
                      hidden={index > tagMaxCount}
                      key={option.id}
                      prefixCls={prefixCls}
                      disabled={disabled}
                      option={option}
                      value={value}
                      displayRender={displayRender}
                      tryChangeValue={tryChangeValue}
                      onTagResize={(id: string, w: number) =>
                        setTagsWidth((prev) => ({ ...prev, [id]: w }))
                      }
                    />
                  )
                })}
              </span>
            ) : (
              <span className={`${prefixCls}__placeholder`}>{placeholder}</span>
            )}

            <ResizeDetector
              skipOnMount={false}
              onResize={(w) => {
                if (w) {
                  setSuffixWidth(w)
                }
              }}
            >
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
        </ResizeDetector>
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
  /**
   * 设置 tag 的默认宽度
   */
  tagWidth?: number
}

if (__DEV__) {
  TagInputMock.displayName = 'TagInputMock'
}

const hiddenStyle: React.CSSProperties = {
  position: 'absolute',
  opacity: 0,
  width: 0,
  height: 0,
  overflow: 'hidden',
  display: 'none',
}

function MockTag({
  prefixCls,
  option,
  disabled,
  value,
  onTagResize,
  tryChangeValue,
  displayRender,
  hidden = false,
}: any) {
  const title = isFunction(displayRender) ? displayRender(option) : true
  const closeable = !option.disabled

  return (
    <ResizeDetector
      skipOnMount={false}
      onResize={(width) => {
        // 隐藏后就不允许设置 tagSize，避免无限循环触发“宽度计算响应式策略”
        if (hidden) return

        if (width !== undefined) {
          onTagResize(option.id, width)
        }
      }}
    >
      <div style={{ display: 'inline-block' }}>
        <span
          className={`${prefixCls}__tag`}
          style={hidden ? hiddenStyle : undefined}
          key={option.id}
        >
          <span className={`${prefixCls}__tag-content`}>
            {title === true ? option.title : title}
          </span>
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
      </div>
    </ResizeDetector>
  )
}
