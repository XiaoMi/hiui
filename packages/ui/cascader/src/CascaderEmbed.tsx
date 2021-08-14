import React, { forwardRef, useCallback, useState, useRef, useMemo } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CascaderItem, ExpandTrigger, FlattedCascaderItem } from './types'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useToggle } from '@hi-ui/use-toggle'
import Input from '@hi-ui/input'
import { CascaderMenus } from './CascaderMenus'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { usePopper } from 'react-popper'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { useSearch } from './hooks'
import { flattenTreeData } from './utils'
import { CascaderSearch } from './CascaderSearch'
import { SearchOutlined } from '@hi-ui/icons'

const _role = 'embed-cascader'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

/**
 * TODO: What is CascaderEmbed
 */
export const CascaderEmbed = forwardRef<HTMLDivElement | null, CascaderEmbedProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      overlayClassName,
      data,
      value: valueProp,
      defaultValue = NOOP_ARRAY,
      expandTrigger = 'click',
      searchable = false,
      appearance,
      clearable = false,
      disabled = false,
      placeholder,
      emptyContent,
      displayRender,
      onChange,
      ...rest
    },
    ref
  ) => {
    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    const [cacheValue, setCacheValue] = useState(value)

    const [menuVisible, menuVisibleAction] = useToggle()
    const [keyword, setKeyword] = useState('')

    const onItemHover = useCallback((evt: any, value: CascaderItem) => {
      tryChangeValue(value)
    }, [])

    const onItemSelect = useCallback((evt: any) => {
      if (menuVisible) return

      if (disabled) return

      if (!searchable) {
        setKeyword('')
        menuVisibleAction.on()
      } else {
        if (value.length > 0) {
          menuVisibleAction.on()
        }

        if (keyword) {
          // onKeywordChange()
        } else {
          tryChangeValue(cacheValue || [])
        }
      }
    }, [])

    const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)
    const popperElRef = useRef<HTMLDivElement | null>(null)
    const [arrowElRef, setArrowElmRef] = useState<HTMLElement | null>(null)
    const cascaderRef = useRef<HTMLDivElement | null>(null)
    useOutsideClick(cascaderRef, menuVisibleAction.off)

    const { styles, attributes } = usePopper(targetElRef, popperElRef.current, {
      placement: 'bottom-end',
      modifiers: [
        {
          enabled: true,
          name: 'arrow',
          options: {
            element: arrowElRef,
          },
        },
        {
          enabled: true,
          name: 'offset',
          options: {
            offset: [4, 4],
          },
        },
      ],
    })

    const cls = cx(prefixCls, className)

    const flattedData = useMemo(() => flattenTreeData(data), [data])

    const [isSearch, matchedNodes, inputProps, isEmpty] = useSearch(flattedData)
    console.log(matchedNodes, flattedData)

    if (data.length === 0) return null

    return (
      <div
        ref={useMergeRefs(ref, cascaderRef)}
        role={role}
        className={cls}
        onClick={(evt) => {
          evt.stopPropagation()
          menuVisibleAction.on()
        }}
        {...rest}
      >
        <Input
          appearance="underline"
          prefix={<SearchOutlined />}
          value={inputProps.value}
          onChange={inputProps.onChange}
        />

        {isSearch ? (
          <CascaderSearch data={matchedNodes} onCheck={onItemSelect} />
        ) : (
          <CascaderMenus data={flattedData} value={value} onChange={tryChangeValue} />
        )}
      </div>
    )
  }
)

export interface CascaderEmbedProps {
  /**
   * 组件默认的选择器类
   */
  prefixCls?: string
  /**
   * 组件的语义化 Role 属性
   */
  role?: string
  /**
   * 组件的注入选择器类
   */
  className?: string
  /**
   * 组件的注入样式
   */
  style?: React.CSSProperties
  /**
   *   下拉根元素的类名称
   */
  overlayClassName?: string
  /**
   * 设置选择项数据源
   */
  data: CascaderItem[]
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
   * 选项被点击时的回调
   */
  onSelect?: (selectedIds: React.ReactText[], item: CascaderItem) => void
  /**
   * 次级菜单的展开方式
   */
  expandTrigger?: ExpandTrigger
  /**
   * 是否可搜索
   */
  searchable?: boolean
  /**
   * 是否有边框	boolean	true | false	true
   */
  appearance?: 'outlined'
  /**
   * 是否可清空	boolean	true | false	true
   */
  clearable?: boolean
  /**
   * 是否禁止使用	boolean	true | false	false
   */
  disabled?: boolean
  /**
   * 输入框占位	string	-	'请选择'
   */
  placeholder?: string
  /**
   * 设置选项为空时展示的内容
   */
  emptyContent?: React.ReactNode
  /**
   * 是否启用选择即改变功能
   */
  changeOnSelect?: boolean
  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: FlattedCascaderItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容
   */
  displayRender?: (value: React.ReactText[][]) => React.ReactNode
  /**
   * 支持 checkbox 级联功能
   */
  cascadeCheckbox?: boolean
  /**
   * 开启全量搜索，默认只对开启 checkable 的选项进行搜索
   */
  fullMatch?: boolean
  /**
   * 内嵌于页面中展示（单独抽离组件使用即可！废弃）
   */
  embedded?: boolean
  // defaultSelectedIds?: React.ReactText[]
}

if (__DEV__) {
  CascaderEmbed.displayName = 'CascaderEmbed'
}
