import React, {
  forwardRef,
  useCallback,
  useState,
  useMemo,
  useLayoutEffect,
  useEffect,
} from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CloseCircleFilled, CloseOutlined } from '@hi-ui/icons'
import { TagInputOption } from './types'
import { HiBaseAppearanceEnum, HiBaseHTMLFieldProps } from '@hi-ui/core'
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
      disabled = false,
      clearable = true,
      focused = false,
      invalid = false,
      readOnly = false,
      size = 'md',
      appearance = 'line',
      wrap = false,
      expandable = false,
      activeExpandable = false,
      suffix,
      // tag 最小宽度
      tagWidth = 20,
      displayRender,
      onMouseOver,
      onMouseLeave,
      onClear,
      onExpand,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)

    const tagList = useMemo(
      () => value.map((id) => data.find((item) => item.id === id) || { id, title: id }),
      [value, data]
    )
    const tagCount = tagList.length

    const [containerWidth = 0, setContainerWidth] = useState<number>()

    const mergedTagList = useMemo(() => {
      if (wrap) {
        return tagList
      }
      return tagList.slice(0, Math.min(tagList.length, containerWidth / tagWidth))
    }, [tagList, tagWidth, containerWidth, wrap])

    const showTags = mergedTagList.length > 0

    const showTagCount = !wrap && showTags

    const [tagsWidth, setTagsWidth] = useState<{ [key: string]: number }>({})
    const getTagWidth = useCallback(
      (index: number) => {
        return (
          (typeof mergedTagList[index] !== 'undefined' && tagsWidth[mergedTagList[index].id]) || 0
        )
      },
      [tagsWidth, mergedTagList]
    )

    const [suffixWidth, setSuffixWidth] = useState(0)

    // TODO: 设置第一个 tagWidth 超出省略，预防无展示
    // const [tagMaxWidth, setTagMaxWidth] = useState(0)
    const [tagMaxCount, setTagMaxCount] = useState(0)

    useLayoutEffect(() => {
      let tagMaxCount = 0

      if (isArrayNonEmpty(mergedTagList)) {
        const len = mergedTagList.length
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
            tagMaxCount = lastIndex
            break
          } else if (totalWidth > containerWidth) {
            tagMaxCount = i - 1
            break
          }
        }
      } else {
        tagMaxCount = 0
      }

      // 保底要展示 1 个
      setTagMaxCount(isArrayNonEmpty(mergedTagList) && tagMaxCount < 1 ? 1 : tagMaxCount)
    }, [tagsWidth, suffixWidth, getTagWidth, containerWidth, mergedTagList, suffix])

    // mergedTagList 更新后同步更新 tagsWidth
    useEffect(() => {
      const updatedTagsWidth: { [key: string]: number } = {}

      mergedTagList.forEach((item) => {
        const { id } = item
        updatedTagsWidth[id] = tagsWidth[id] ?? 0
      })

      setTagsWidth(updatedTagsWidth)
    }, [mergedTagList])

    const onClearLatest = useLatestCallback(onClear)
    const handleClear = useCallback(
      (evt) => {
        if (disabled) return

        evt.stopPropagation()
        tryChangeValue(NOOP_ARRAY, tagList, false)
        onClearLatest()
      },
      [tryChangeValue, disabled, onClearLatest, tagList]
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
    const showClearableIcon = clearable && showTags && !disabled
    const maxTagWidth = containerWidth - suffixWidth

    const cls = cx(
      prefixCls,
      className,
      `${prefixCls}--appearance-${appearance}`,
      `${prefixCls}--size-${size}`,
      focused && `focused`,
      readOnly && 'readonly',
      invalid && 'invalid',
      disabled && `${prefixCls}--disabled`,
      wrap && `${prefixCls}--wrap`,
      expandable && `${prefixCls}--expandable`
    )

    return (
      <ResizeDetector
        skipOnMount={false}
        onResize={(w) => {
          if (w) {
            setContainerWidth(w)
          }
        }}
      >
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
          {/* tags 列表区域渲染 */}
          {showTags ? (
            <span className={`${prefixCls}__tags`}>
              {mergedTagList.map((option, index) => {
                return (
                  <MockTag
                    hidden={wrap ? false : index > tagMaxCount}
                    maxWidth={maxTagWidth}
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
            {!!suffix || (showClearableIcon && hover) || showTagCount ? (
              <span className={`${prefixCls}__suffix`}>
                {showTagCount ? (
                  <span
                    className={cx(
                      `${prefixCls}__tag--total`,
                      activeExpandable && `${prefixCls}__tag--active`
                    )}
                    onClick={onExpand}
                  >
                    {`${tagCount > 99 ? '99+' : tagCount}`}
                  </span>
                ) : null}
                {showClearableIcon && hover ? (
                  <span
                    className={`${prefixCls}__clear`}
                    role="button"
                    tabIndex={-1}
                    onClick={handleClear}
                  >
                    <CloseCircleFilled />
                  </span>
                ) : (
                  suffix
                )}
              </span>
            ) : null}
          </ResizeDetector>
        </div>
      </ResizeDetector>
    )
  }
)

export interface TagInputMockProps
  extends Omit<HiBaseHTMLFieldProps<'div'>, 'defaultValue' | 'onChange' | 'value'> {
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
  onChange?: (
    values: React.ReactText[],
    targetItem: TagInputOption[],
    shouldChecked: boolean
  ) => void
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
  /**
   * 是否聚焦
   */
  focused?: boolean
  /**
   * 开启输入框只读
   */
  readOnly?: boolean
  /**
   * 设置展现形式
   */
  appearance?: HiBaseAppearanceEnum
  /**
   * 设置输入框尺寸
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * 是否开启换行全展示
   */
  wrap?: boolean
  /**
   * 开启展开
   */
  expandable?: boolean
  /**
   * 展开激活
   */
  activeExpandable?: boolean
  /**
   * 展开时回调
   */
  onExpand?: (evt: React.MouseEvent) => void
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
  maxWidth,
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
      <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
        <span
          className={`${prefixCls}__tag`}
          style={hidden ? hiddenStyle : { maxWidth }}
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
                tryChangeValue(nextValue, [option], false)
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
