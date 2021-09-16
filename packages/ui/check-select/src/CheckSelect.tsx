import React, { forwardRef, useCallback, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import Input from '@hi-ui/input'
import { useToggle } from '@hi-ui/use-toggle'
import { useCheckSelect } from './use-check-select'
import type { HiBaseHTMLProps } from '@hi-ui/core'
import Popper, { PopperProps } from '@hi-ui/popper'
import { DownOutlined, SearchOutlined } from '@hi-ui/icons'
import { SelectProvider, useSelectContext } from './context'
import { CheckSelectItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import Checkbox from '@hi-ui/checkbox'
import { TagInput } from '@hi-ui/tag-input'

const _role = 'check-select'
const _prefix = getPrefixCls(_role)

/**
 * TODO: What is CheckSelect
 */
export const CheckSelect = forwardRef<HTMLDivElement | null, CheckSelectProps>(
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

    const displayRender = useCallback(
      (item: CheckSelectItem) => {
        if (displayRenderProp) {
          return displayRenderProp(item)
        }

        return item.title
      },
      [displayRenderProp]
    )

    // @ts-ignore
    const { rootProps, ...context } = useCheckSelect({
      ...rest,
      onSelect: onSelectLatest,
      children,
    })
    const { value, tryChangeValue, data: selectData } = context

    const cls = cx(prefixCls, className)

    return (
      <SelectProvider value={context}>
        <div ref={ref} role={role} className={cls} {...rootProps}>
          <TagInput
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
              {/* 反向 map，搜索删选数据时会对数据进行处理 */}
              {selectData.map((item) => {
                return <CheckSelectOption key={item.id} option={item} />
              })}
            </div>
          </Popper>
        </div>
      </SelectProvider>
    )
  }
)

export interface CheckSelectProps
  extends Omit<HiBaseHTMLProps<'div'>, 'onChange' | 'onSelect' | 'defaultValue'> {
  /**
   * 设置当前选中值
   */
  value?: React.ReactText[]
  /**
   * 设置当前选中值默认值
   */
  defaultValue?: React.ReactText[]
  /**
   * 选中值改变时的回调
   */
  onChange?: (
    value: React.ReactText[],
    targetOption?: CheckSelectItem,
    shouldChecked?: boolean
  ) => void
  /**
   * 选中值时回调
   */
  onSelect?: (
    value: React.ReactText[],
    targetOption?: CheckSelectItem,
    shouldChecked?: boolean
  ) => void
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
  titleRender?: (item: CheckSelectItem) => React.ReactNode
  /**
   * 自定义选择后触发器所展示的内容，只在 title 为字符串时有效
   */
  displayRender?: (option: CheckSelectItem) => React.ReactNode
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
  onSearch?: (item: CheckSelectItem) => Promise<CheckSelectItem[] | void> | void
  /**
   * 选项数据
   */
  data?: CheckSelectItem[]
}

// @ts-ignore
CheckSelect.HiName = 'CheckSelect'
if (__DEV__) {
  CheckSelect.displayName = 'CheckSelect'
}

const searchPrefix = getPrefixCls('check-select-search')

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

const optionPrefix = getPrefixCls('check-select-option')

export const CheckSelectOption = forwardRef<HTMLDivElement | null, CheckSelectOptionProps>(
  ({ prefixCls = optionPrefix, className, children, option = {}, ...rest }, ref) => {
    const { isSelectedId, onSelect, titleRender } = useSelectContext()

    const checked = !!isSelectedId(option.id)
    const cls = cx(prefixCls, className, checked && `${prefixCls}--selected`)

    const handleOptionCheck = useCallback(
      (evt) => {
        onSelect(option, !checked)
      },
      [onSelect, option, checked]
    )

    // 如果 titleRender 返回 `true`，则使用默认 title
    const title = titleRender ? titleRender({ ...option, checked }) : true
    if (title !== true) {
      return (
        <div ref={ref} className={cls} {...rest}>
          {title}
        </div>
      )
    }

    return (
      <div ref={ref} className={cls} {...rest}>
        <Checkbox checked={checked} onChange={handleOptionCheck}>
          {option.title}
        </Checkbox>
      </div>
    )
  }
)

export interface CheckSelectOptionProps extends HiBaseHTMLProps {}
// @ts-ignore
CheckSelectOption.HiName = 'CheckSelectOption'

if (__DEV__) {
  CheckSelectOption.displayName = 'CheckSelectOption'
}
