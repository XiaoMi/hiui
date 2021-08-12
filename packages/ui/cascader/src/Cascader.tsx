import React, { forwardRef, useCallback, useState, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { CascaderItem, ExpandTrigger } from './type'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useToggle } from '@hi-ui/use-toggle'
import Input from '@hi-ui/input'
import { CascaderMenu } from './CascaderMenu'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { usePopper } from 'react-popper'
import { useMergeRefs } from '@hi-ui/use-merge-refs'
import { defaultSuffixIcon } from './icons'

const _role = 'cascader'
const _prefix = getPrefixCls(_role)

const NOOP_ARRAY = [] as []

/**
 * TODO: What is Cascader
 */
export const Cascader = forwardRef<HTMLDivElement | null, CascaderProps>(
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
      tabIndex = 0,
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

    const onSelectClick = useCallback((evt: any) => {
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

    return (
      <div
        ref={useMergeRefs(ref, cascaderRef)}
        role={role}
        className={cls}
        tabIndex={tabIndex}
        onClick={(evt) => {
          // 阻止冒泡，避免触发节点选中
          evt.stopPropagation()
          menuVisibleAction.not()
        }}
        {...rest}
      >
        <Input ref={setTargetElRef} suffix={defaultSuffixIcon} />
        {data && menuVisible ? (
          <div ref={popperElRef} style={{ ...styles.popper, zIndex: 2 }} {...attributes.popper}>
            <div ref={setArrowElmRef} style={styles.arrow} />
            <CascaderMenu data={data} />
          </div>
        ) : null}
      </div>
    )
  }
)

export interface CascaderProps {
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
  data?: CascaderItem[]
  /**
   * 设置当前选中值
   */
  value?: React.ReactText[]
  /**
   * 设置当前选中值默认值
   */
  defaultValue?: React.ReactText[]
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
   * 自定义选择后展示的内容
   */
  displayRender?: (value: React.ReactText[]) => React.ReactNode
  /**
   *   选择后的回调
   */
  onChange?: (values: React.ReactText[]) => void
}

if (__DEV__) {
  Cascader.displayName = 'Cascader'
}
