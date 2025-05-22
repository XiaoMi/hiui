import React, { forwardRef, useCallback, useImperativeHandle, useState, useRef } from 'react'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { __DEV__ } from '@hi-ui/env'
import { HiBaseHTMLFieldProps, useLocaleContext } from '@hi-ui/core'
import Input from '@hi-ui/input'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import { PopperOverlayProps, Popper } from '@hi-ui/popper'
import { SearchOutlined } from '@hi-ui/icons'
import { useLatestCallback } from '@hi-ui/use-latest'
import { mockDefaultHandlers } from '@hi-ui/dom-utils'
import Loading from '@hi-ui/loading'

import { isUndef } from '@hi-ui/type-assertion'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'

const PICKER_PREFIX = getPrefixCls('picker')

/**
 * 选择器
 */
export const Picker = forwardRef<HTMLDivElement | null, PickerProps>(
  (
    {
      prefixCls = PICKER_PREFIX,
      role = 'picker',
      className,
      children,
      disabled = false,
      clearable = false,
      searchable = false,
      keyword: keywordProp,
      scrollable = true,
      creatableInSearch = false,
      createTitle: createTitleProp,
      onCreate,
      visible,
      onOpen,
      onClose,
      searchPlaceholder: searchPlaceholderProp,
      loadingContent: loadingContentProp,
      emptyContent: emptyContentProp,
      showEmpty = true,
      loading = false,
      optionWidth,
      overlayClassName,
      overlay,
      onSearch,
      closeOnEsc = true,
      invalid = false,
      onKeyDown,
      trigger,
      footer,
      onOverlayScroll,
      innerRef,
      ...rest
    },
    ref
  ) => {
    const i18n = useLocaleContext()

    const searchPlaceholder = isUndef(searchPlaceholderProp)
      ? creatableInSearch
        ? i18n.get('picker.createPlaceholder')
        : i18n.get('picker.searchPlaceholder')
      : searchPlaceholderProp
    const loadingContent = isUndef(loadingContentProp)
      ? i18n.get('picker.loadingContent')
      : loadingContentProp
    const emptyContent = isUndef(emptyContentProp)
      ? i18n.get('picker.emptyContent')
      : emptyContentProp
    const createTitle = isUndef(createTitleProp) ? i18n.get('picker.createTitle') : createTitleProp

    // *********************** 搜索管理 ********************** //

    const [searchValue, setSearchValue] = useUncontrolledState(
      '' as string,
      keywordProp,
      onSearch,
      Object.is
    )
    // const inSearch = searchable && !!searchValue
    // const isEmpty = inSearch && showEmpty
    const resetSearchOnClosed = keywordProp === undefined

    const onSearchLatest = useLatestCallback(onSearch)

    const handleChange = useCallback(
      (evt: React.ChangeEvent<HTMLInputElement>) => {
        if (!searchable) return

        const nextSearchValue = evt.target.value

        setSearchValue(nextSearchValue)
      },
      [searchable, setSearchValue]
    )

    const resetSearch = useCallback(() => {
      setSearchValue('')
    }, [setSearchValue])

    const getSearchInputProps = useCallback(() => {
      return {
        value: searchValue,
        onChange: handleChange,
      }
    }, [searchValue, handleChange])

    // *********************** 弹窗管理 ********************** //

    const [targetElement, setTargetElement] = useState<HTMLDivElement | null>(null)

    const [menuVisible, menuVisibleAction] = useUncontrolledToggle({
      defaultVisible: false,
      visible,
      onOpen,
      onClose,
    })

    const showMenu = useCallback(() => {
      if (disabled) return
      menuVisibleAction.on()
    }, [disabled, menuVisibleAction])

    const hideMenu = useCallback(() => {
      if (disabled) return
      menuVisibleAction.off()
      resetSearchOnClosed && resetSearch()
    }, [resetSearchOnClosed, disabled, menuVisibleAction, resetSearch])

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

    const popperRef = useRef<
      (HTMLDivElement & { update: () => void; forceUpdate: () => void }) | null
    >(null)

    useImperativeHandle(innerRef, () => ({
      resetSearch: () => {
        resetSearchOnClosed && resetSearch()
      },
      update: () => {
        popperRef.current?.update()
      },
      forceUpdate: () => {
        popperRef.current?.forceUpdate()
      },
    }))

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
          ref: setTargetElement,
          onClick: mockDefaultHandlers(trigger.props.onClick, menuVisible ? hideMenu : showMenu),
          disabled: disabled,
        })}
        <Popper
          ref={popperRef}
          matchWidth={optionWidth === undefined}
          matchWidthStrictly
          gutterGap={2}
          // @DesignToken zIndex: overlay
          zIndex={1050}
          {...overlay}
          className={cx(`${prefixCls}__popper`, overlayClassName, overlay?.className)}
          autoFocus={false}
          visible={menuVisible}
          onClose={hideMenu}
          onEntered={() => {
            if (menuVisible) {
              // 让搜索框获取焦点
              searchInputElement?.focus()
            }
          }}
          attachEl={targetElement}
        >
          <div
            className={`${prefixCls}__panel`}
            style={{ minWidth: optionWidth, width: optionWidth }}
          >
            {searchable ? (
              <div className={`${prefixCls}__search`}>
                <Input
                  ref={setSearchInputElement}
                  appearance="underline"
                  size="lg"
                  // TODO: Why not take effect
                  // autoFocus
                  prefix={<SearchOutlined />}
                  clearable
                  clearableTrigger="always"
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
            <div
              className={`${prefixCls}__body`}
              style={{ overflowY: scrollable ? 'auto' : 'hidden' }}
              onScroll={onOverlayScroll}
            >
              {loading ? (
                <div className={`${prefixCls}__loading`}>
                  {loadingContent}
                  <Loading size="sm" />
                </div>
              ) : (
                children ||
                (creatableInSearch && searchValue ? (
                  <div className={`${prefixCls}__creator`} onClick={() => onCreate?.(searchValue)}>
                    <span className={`${prefixCls}__creator-title`}>{createTitle}</span>
                    <span className={`${prefixCls}__creator-value`}>{searchValue}</span>
                  </div>
                ) : showEmpty ? (
                  <span className={`${prefixCls}__empty`}>{emptyContent}</span>
                ) : null)
              )}
            </div>
            {footer ? <div className={`${prefixCls}__footer`}>{footer}</div> : null}
          </div>
        </Popper>
      </div>
    )
  }
)

export interface PickerHelper {
  resetSearch: () => void
  update: () => void
  forceUpdate: () => void
}

export interface PickerProps extends HiBaseHTMLFieldProps<'div'> {
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 设置选项为空时展示的内容
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
   * 下拉根元素的类名称
   */
  overlayClassName?: string
  /**
   * 是否可搜索
   */
  searchable?: boolean
  /**
   * 搜索关键字，searchable 为 true 时有效
   */
  keyword?: string
  /**
   * 在搜索状态下是否可创建选项
   */
  creatableInSearch?: boolean
  /**
   * 创建选项时展示的标题
   */
  createTitle?: string
  /**
   * 创建选项时触发回调
   */
  onCreate?: (keyword: string) => void
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
  overlay?: PopperOverlayProps
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
   * 下拉菜单打开时回调
   */
  onOpen?: () => void
  /**
   * 下拉菜单关闭时回调
   */
  onClose?: () => void
  /**
   * 是否在加载中
   */
  loading?: boolean
  /**
   * 自定义下拉菜单底部渲染
   */
  footer?: React.ReactNode
  /**
   * 下拉列表滚动时的回调
   */
  onOverlayScroll?: () => void
  /**
   * 触发器
   */
  trigger: any
  /**
   * 开启内容区域可滚动
   */
  scrollable?: boolean
  /**
   * 提供辅助方法的内部引用
   */
  innerRef?: React.Ref<PickerHelper>
}

if (__DEV__) {
  Picker.displayName = 'Picker'
}
