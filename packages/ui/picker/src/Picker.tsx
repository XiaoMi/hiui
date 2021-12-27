import React, { forwardRef, useCallback, useRef, useState } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLFieldProps } from '@hi-ui/core'
import { PickerDataItem } from './types'
import Input from '@hi-ui/input'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { PopperPortal as Popper, PopperProps } from '@hi-ui/popper'
import { SearchOutlined } from '@hi-ui/icons'
import { useLatestCallback } from '@hi-ui/use-latest'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import Loading from '@hi-ui/loading'

const PICKER_PREFIX = getPrefixCls('picker')
const DEFAULT_DATA = [] as []

/**
 * TODO: What is Picker
 */
export const Picker = forwardRef<HTMLDivElement | null, PickerProps>(
  (
    {
      prefixCls = PICKER_PREFIX,
      role = 'picker',
      className,
      children,
      data = DEFAULT_DATA,
      disabled = false,
      clearable = false,
      bordered = true,
      searchable = false,
      visible,
      onOpen,
      onClose,
      value,
      onChange,
      displayRender,
      placeholder,
      searchPlaceholder = '搜索',
      loadingContent = '数据加载中...',
      emptyContent = '无匹配数据',
      showEmpty = true,
      loading = false,
      optionWidth,
      overlayClassName,
      popper,
      onSearch,
      closeOnEsc = true,
      invalid = false,
      onKeyDown,
      trigger,
      footer,
      onOverlayScroll,
      ...rest
    },
    ref
  ) => {
    // *********************** 搜索管理 ********************** //

    const [searchValue, setSearchValue] = useState('')

    // const inSearch = searchable && !!searchValue
    // const isEmpty = inSearch && showEmpty

    const onSearchLatest = useLatestCallback(onSearch)

    const handleChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!searchable) return

        const nextSearchValue = evt.target.value

        setSearchValue(nextSearchValue)
        // TODO: debounce
        onSearchLatest(nextSearchValue)
      },
      [onSearchLatest, searchable]
    )

    const resetSearch = useCallback(() => {
      setSearchValue('')
      onSearchLatest('')
    }, [onSearchLatest])

    const getSearchInputProps = useCallback(() => {
      return {
        value: searchValue,
        onChange: handleChange,
        onKeyDown: (evt: any) => {
          if (evt.keyCode === 13) {
            evt.preventDefault()
            onSearchLatest(searchValue)
          }
        },
      }
    }, [searchValue, handleChange, onSearchLatest])

    // *********************** 弹窗管理 ********************** //

    const targetElementRef = useRef<HTMLDivElement>(null)

    const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
      defaultVisible: false,
      visible,
      onOpen,
      onClose,
    })

    const openMenu = useCallback(() => {
      if (disabled) return
      menuVisibleAction.on()
    }, [disabled, menuVisibleAction])

    const hideMenu = useCallback(() => {
      if (disabled) return
      menuVisibleAction.off()
      resetSearch()
    }, [disabled, menuVisibleAction, resetSearch])

    const onEscClose = useCallback(
      (evt: React.KeyboardEvent) => {
        // only close the top modal when pressing `Esc`
        if (evt.keyCode !== 27) return

        if (closeOnEsc) {
          evt.preventDefault()
          evt.stopPropagation()
          hideMenu()
        }
      },
      [closeOnEsc, hideMenu]
    )

    const [searchInputElement, setSearchInputElement] = useState<HTMLInputElement | null>(null)

    const cls = cx(prefixCls, className, `${prefixCls}--${menuVisible ? 'open' : 'closed'}`)

    return (
      <div
        ref={ref}
        role={role}
        className={cls}
        tabIndex={0}
        onKeyDown={mockDefaultHandlers(onKeyDown, onEscClose)}
        {...rest}
      >
        {React.cloneElement(trigger, {
          ref: targetElementRef,
          onClick: openMenu,
          disabled: disabled,
        })}
        <Popper
          matchWidth={optionWidth === undefined}
          gutterGap={2}
          zIndex={800}
          {...popper}
          className={cx(`${prefixCls}__popper`, overlayClassName)}
          autoFocus={false}
          visible={menuVisible}
          onClose={hideMenu}
          onEntered={() => {
            if (menuVisible) {
              // 让搜索框获取焦点
              searchInputElement?.focus()
            }
          }}
          attachEl={targetElementRef.current}
        >
          <div className={`${prefixCls}__panel`} style={{ width: optionWidth }}>
            {searchable ? (
              <div className={`${prefixCls}__search`}>
                <Input
                  ref={setSearchInputElement}
                  appearance="underline"
                  // TODO: Why not take effect
                  // autoFocus
                  prefix={<SearchOutlined />}
                  placeholder={searchPlaceholder}
                  {...getSearchInputProps()}
                />
              </div>
            ) : null}
            {/* TODO: 抽离页面数据处理渲染器
                1. 有数据
                3. 无数据
                2. 动态加载中
                4. 动态搜索无结果
            */}
            <div className={`${prefixCls}__body`} onScroll={onOverlayScroll}>
              {loading ? (
                <div className={`${prefixCls}__loading`}>
                  {loadingContent}
                  <Loading size="sm" />
                </div>
              ) : (
                children ||
                (showEmpty ? <span className={`${prefixCls}__empty`}>{emptyContent}</span> : null)
              )}
            </div>
            {footer ? <div className={`${prefixCls}__footer`}>{footer}</div> : null}
          </div>
        </Popper>
      </div>
    )
  }
)

export interface PickerProps extends HiBaseHTMLFieldProps<'div'> {
  /**
   * 展示数据
   */
  data?: PickerDataItem[]
  /**
   * 是否有边框
   */
  bordered?: boolean
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 默认选中项 （受控）
   */
  value?: React.ReactText
  /**
   * 自定义渲染 Input 中展示内容
   */
  displayRender?: (item: PickerDataItem) => React.ReactNode
  /**
   * 输入框占位	string	-	请选择
   */
  placeholder?: string
  /**
   * 没有选项时的提示
   */
  emptyContent?: React.ReactNode
  /**
   * 加载中时的提示
   */
  loadingContent?: React.ReactNode
  /**
   * 展示未搜索结果
   */
  showEmpty?: boolean
  /**
   * 自定义下拉选项宽度
   */
  optionWidth?: number
  /**
   * 下拉根元素的类名称 (3.0 新增)
   */
  overlayClassName?: string
  /**
   * 开启搜索
   */
  searchable?: boolean
  /**
   * 搜索时触发回调
   */
  onSearch?: (keyword: string) => void
  /**
   * 是否可清空
   */
  clearable?: boolean
  /**
   * 自定义控制 popper 行为
   */
  popper?: PopperProps
  /**
   * 值改变时回调
   */
  onChange?: (value: React.ReactText) => void
  /**
   * 开启 Esc 快捷键关闭
   */
  closeOnEsc?: boolean
  /**
   * 搜索的占位符
   */
  searchPlaceholder?: string
  /**
   * 控制气泡卡片的显示和隐藏（受控）
   */
  visible?: boolean
  /**
   * 打开时回调
   */
  onOpen?: () => void
  /**
   * 关闭时回调
   */
  onClose?: () => void
  /**
   * 是否在加载中
   */
  loading?: boolean
  trigger: any
  /**
   * 自定义下拉菜单底部渲染
   */
  footer?: React.ReactNode
  /**
   * 下拉列表滚动时的回调
   */
  onOverlayScroll?: () => void
}

if (__DEV__) {
  Picker.displayName = 'Picker'
}
