import React, { forwardRef, useRef, useCallback, useState, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CloseCircleFilled, CloseOutlined } from '@hi-ui/icons'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useTagInput } from './use-tag-input'
import { TagInputOption } from './types'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { HiBaseHTMLProps } from '@hi-ui/core'

const _role = 'tag-input'
const _prefix = getPrefixCls(_role)
const NOOP_ARRAY = [] as []

/**
 * TODO: What is TagInput
 */
export const TagInput = forwardRef<HTMLDivElement | null, TagInputProps>(
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
      wrap = true,
      clearable = false,
      disabled = false,
      suffix,
      displayRender,
      onClick,
      onMouseOver,
      onMouseLeave,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const tagInputRef = useRef<HTMLDivElement>(null)
    const [tagMaxWidth] = useTagInput(data, tagInputRef)

    const handleClear = useCallback(
      (evt) => {
        if (disabled) return
        evt.stopPropagation()
        tryChangeValue(NOOP_ARRAY)
      },
      [tryChangeValue, disabled]
    )

    const tagList = useMemo(
      () => value.map((id) => data.find((item) => item.id === id) || { id, title: id }),
      [value, data]
    )

    const [hover, setHover] = useState(false)
    const trySetHover = useCallback(
      (hovered: boolean) => {
        if (disabled) return
        setHover(hovered)
      },
      [disabled]
    )

    const tagCount = tagList.length
    // 在开启 clearable 下展示 清除内容按钮，可点击进行内容清楚
    const showClearableIcon = clearable && tagCount > 0 && !disabled
    const showTagCount = !wrap && tagCount > 0

    const [expanded, setExpanded] = useState(false)

    useOutsideClick(tagInputRef, () => setExpanded(false))

    const handleExpand = useCallback((evt: React.MouseEvent) => {
      evt.stopPropagation()
      setExpanded(true)
    }, [])

    const cls = cx(
      prefixCls,
      className,
      expanded ? `${prefixCls}--expanded` : wrap ? `${prefixCls}--wrap` : `${prefixCls}--nowrap`
    )

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
        <div className={cx(`${prefixCls}__container`, disabled && 'disabled')} onClick={onClick}>
          {value.length !== 0 ? (
            <span className={`${prefixCls}__value`}>
              <span className={cx(`${prefixCls}__tags`, wrap && `${prefixCls}__tags--all`)}>
                {tagList.map((option) => {
                  const title = displayRender ? displayRender(option) : true
                  const closeable = !option.disabled
                  return (
                    <span className={`${prefixCls}__tag`} key={option.id}>
                      <span
                        className={`${prefixCls}__tag-content`}
                        style={{ maxWidth: tagMaxWidth }}
                      >
                        {title === true ? option.title : title}
                      </span>
                      {closeable ? (
                        <span
                          className={`${prefixCls}__tag-closed`}
                          onClick={(evt) => {
                            if (disabled) return

                            evt.stopPropagation()
                            const nextValue = [...value].filter((id) => id !== option.id)
                            tryChangeValue(nextValue)
                          }}
                        >
                          <CloseOutlined />
                        </span>
                      ) : null}
                    </span>
                  )
                })}
              </span>
            </span>
          ) : (
            <span className={`${prefixCls}__placeholder`}>{placeholder}</span>
          )}
          {!!suffix || (showClearableIcon && hover) || showTagCount ? (
            <span className={`${prefixCls}__suffix`}>
              {showTagCount ? (
                <span className={cx(`${prefixCls}__tag--total`)} onClick={handleExpand}>
                  {`${tagCount > 99 ? '+99' : tagCount}`}
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
        </div>

        {value.length !== 0 && expanded ? (
          <div className={`${prefixCls}__container__expand`}>
            <span className={cx(`${prefixCls}__value`)}>
              <span className={cx(`${prefixCls}__tags`, `${prefixCls}__tags--all`)}>
                {tagList.map((option) => {
                  const title = displayRender ? displayRender(option) : true
                  const closeable = !option.disabled

                  return (
                    <span className={`${prefixCls}__tag`} key={option.id}>
                      <span
                        className={`${prefixCls}__tag-content`}
                        style={{ maxWidth: tagMaxWidth }}
                      >
                        {title === true ? option.title : title}
                      </span>
                      {closeable ? (
                        <span
                          className={`${prefixCls}__tag-closed`}
                          onClick={(evt) => {
                            if (disabled) return

                            evt.stopPropagation()
                            const nextValue = [...value].filter((id) => id !== option.id)
                            tryChangeValue(nextValue)
                          }}
                        >
                          <CloseOutlined />
                        </span>
                      ) : null}
                    </span>
                  )
                })}
              </span>
            </span>
            {showClearableIcon ? (
              <span className={`${prefixCls}__suffix`}>
                <span
                  className={`${prefixCls}__clear`}
                  role="button"
                  tabIndex={-1}
                  onClick={handleClear}
                >
                  <CloseCircleFilled />
                </span>
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    )
  }
)

export interface TagInputProps extends HiBaseHTMLProps {
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
   * 是否开启换行全展示
   */
  wrap?: boolean
  /**
   * 输入框后置内容
   */
  suffix?: React.ReactNode
  /**
   * tag 列表数据源
   */
  data?: TagInputOption[]
}

if (__DEV__) {
  TagInput.displayName = 'TagInput'
}
