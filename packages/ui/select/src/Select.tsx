import React, { forwardRef, useCallback, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Input, { MockInput } from '@hi-ui/input'
import { useToggle } from '@hi-ui/use-toggle'
import { useSelect } from './use-select'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import Popper, { PopperProps } from '@hi-ui/popper'
import { DownOutlined, SearchOutlined } from '@hi-ui/icons'
import { SelectProvider, useSelectContext } from './context'
import { SelectItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'

const _role = 'select'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is Select
 */
export const Select = forwardRef<HTMLDivElement | null, SelectProps>(
  (
    {
      prefixCls = _prefix,
      role = _role,
      className,
      children,
      disabled = false,
      clearable = false,
      searchable = false,
      placeholder,
      displayRender: displayRenderProp,
      onSelect: onSelectProp,
      popper,
      ...rest
    },
    ref
  ) => {
    const [menuVisible, menuVisibleAction] = useToggle()
    const [targetElRef, setTargetElRef] = useState<HTMLElement | null>(null)

    const openMenu = useCallback(() => {
      if (disabled) return
      menuVisibleAction.on()
    }, [disabled, menuVisibleAction])

    const onSelectLatest = useLatestCallback(onSelectProp)
    const onSelect = useCallback(
      (value: React.ReactText, item: SelectItem) => {
        onSelectLatest(value, item)
        // 关闭弹窗
        menuVisibleAction.off()
      },
      [menuVisibleAction, onSelectLatest]
    )

    const displayRender = useCallback(
      (item: SelectItem) => {
        if (displayRenderProp) {
          return displayRenderProp(item)
        }

        return item.title
      },
      [displayRenderProp]
    )

    // @ts-ignore
    const { rootProps, ...context } = useSelect({ ...rest, onSelect, children })
    const { value, tryChangeValue, data: selectData } = context

    const cls = cx(prefixCls, className)
    console.log(selectData)

    return (
      <SelectProvider value={context}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          <MockInput
            ref={setTargetElRef}
            onClick={openMenu}
            disabled={disabled}
            clearable={clearable}
            placeholder={placeholder}
            data={selectData}
            value={value}
            onChange={tryChangeValue}
            displayRender={displayRender}
            suffix={<DownOutlined />}
          />
          <Popper
            {...popper}
            attachEl={targetElRef}
            visible={menuVisible}
            onClose={menuVisibleAction.off}
          >
            <div className={`${prefixCls}-panel`}>
              {searchable ? <SelectSearch /> : null}
              {/* {children} */}
              {selectData.map((item) => {
                return <SelectOption key={item.id} option={item} />
              })}
            </div>
          </Popper>
        </div>
      </SelectProvider>
    )
  }
)

export interface SelectProps extends Omit<HiBaseHTMLProps<'div'>, 'onChange' | 'onSelect'> {
  /**
   * 设置当前选中值
   */
  value?: React.ReactText
  /**
   * 设置当前选中值默认值
   */
  defaultValue?: React.ReactText
  /**
   * 选中值改变时的回调
   */
  onChange?: (value: React.ReactText, targetOption?: SelectItem) => void
  /**
   * 选中值时回调
   */
  onSelect?: (value: React.ReactText, targetOption?: SelectItem) => void
  /**
   * 是否可搜索（仅在 title 为字符串时支持）
   */
  searchable?: boolean
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 是否禁止使用
   */
  disabled?: boolean
  /**
   * 设置选项为空时展示的内容
   */
  emptyContent?: React.ReactNode
  /**
   * 自定义渲染节点的 title 内容
   */
  titleRender?: (item: SelectItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: SelectItem) => React.ReactNode
  /**
   * 触发器输入框占位符
   */
  placeholder?: string
  /**
   * 搜索输入框占位符
   */
  searchPlaceholder?: string
  /**
   * 自定义控制 popper 行为
   */
  popper?: PopperProps
  /**
   * 搜索数据
   */
  onSearch?: (item: SelectItem) => Promise<SelectItem[] | void> | void
  /**
   * 选项数据
   */
  data?: SelectItem[]
}

// @ts-ignore
Select.HiName = 'Select'
if (__DEV__) {
  Select.displayName = 'Select'
}

const searchPrefix = getPrefixCls('select-search')

export const SelectSearch = forwardRef<HTMLInputElement | null, SelectSearchProps>(
  ({ prefixCls = searchPrefix, className, ...rest }, ref) => {
    const { isEmpty, emptyContent, getSearchInputProps } = useSelectContext()

    return (
      <div ref={ref} className={cx(prefixCls, className)} {...rest}>
        <Input appearance="underline" prefix={<SearchOutlined />} {...getSearchInputProps()} />
        {isEmpty ? <span className={`${prefixCls}__empty`}>{emptyContent}</span> : null}
      </div>
    )
  }
)

export interface SelectSearchProps extends HiBaseHTMLProps {}

if (__DEV__) {
  SelectSearch.displayName = 'SelectSearch'
}

const optionPrefix = getPrefixCls('select-option')

export const SelectOption = forwardRef<HTMLDivElement | null, SelectOptionProps>(
  ({ prefixCls = optionPrefix, className, children, option = {}, onClick, ...rest }, ref) => {
    const { isSelectedId, onSelect } = useSelectContext()

    const cls = cx(prefixCls, className, isSelectedId(option.id) && `${prefixCls}--selected`)

    const onClickLatest = useLatestCallback(onClick)
    const handleClick = useCallback(
      (evt) => {
        onSelect(option)
        onClickLatest(evt)
      },
      [onSelect, option, onClickLatest]
    )

    return (
      <div ref={ref} className={cls} onClick={handleClick} {...rest}>
        <span className={`${prefixCls}__title`}>{option.title}</span>
      </div>
    )
  }
)

export interface SelectOptionProps extends HiBaseHTMLProps {}
// @ts-ignore
SelectOption.HiName = 'SelectOption'

if (__DEV__) {
  SelectOption.displayName = 'SelectOption'
}
