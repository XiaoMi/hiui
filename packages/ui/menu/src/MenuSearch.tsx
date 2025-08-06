import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { HiBaseHTMLProps } from '@hi-ui/core'
import { __DEV__ } from '@hi-ui/env'
import { cx, getPrefixCls } from '@hi-ui/classname'
import { SearchOutlined, CloseOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@hi-ui/icons'
import IconButton from '@hi-ui/icon-button'
import Button from '@hi-ui/button'
import Picker from '@hi-ui/picker'
import Input from '@hi-ui/input'
import Highlighter from '@hi-ui/highlighter'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { useUncontrolledToggle } from '@hi-ui/use-toggle'
import EllipsisTooltip from '@hi-ui/ellipsis-tooltip'
import { useOutsideClick } from '@hi-ui/use-outside-click'
import { MenuDataItem } from './types'
import { EnterIcon } from './EnterIcon'
import { searchMenuWithPath } from './util'

const _role = 'menu-search'
const _prefix = getPrefixCls(_role)

export const MenuSearch = forwardRef<HTMLDivElement | null, MenuSearchProps>(
  (
    {
      innerRef,
      prefixCls = _prefix,
      className,
      clearText,
      placeholder,
      notFoundContent,
      width,
      visible: visibleProp,
      data,
      defaultValue = '',
      value: valueProp,
      onChange,
      onSearch,
      onSelect,
      onClear,
      onClose,
      onEsc,
      ...rest
    },
    ref
  ) => {
    const [visible, visibleAction] = useUncontrolledToggle({
      visible: visibleProp,
    })

    const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChange)
    const [currentIndex, setCurrentIndex] = useState(-1)

    const listRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      if (currentIndex === -1 || !listRef.current) return

      const listContainer = listRef.current
      const selectedItem = listContainer.children[currentIndex] as HTMLElement

      if (!selectedItem) return

      const containerScrollTop = listContainer.scrollTop
      const containerHeight = listContainer.clientHeight
      const itemTop = selectedItem.offsetTop
      const itemHeight = selectedItem.offsetHeight

      // 计算元素的可见范围
      const itemBottom = itemTop + itemHeight
      const visibleTop = containerScrollTop
      const visibleBottom = containerScrollTop + containerHeight

      // 判断是否需要滚动
      const isItemAboveViewport = itemTop < visibleTop
      const isItemBelowViewport = itemBottom > visibleBottom

      if (isItemAboveViewport) {
        // 如果元素在可视区域上方，滚动到元素顶部
        listContainer.scrollTop = itemTop
      } else if (isItemBelowViewport) {
        // 如果元素在可视区域下方，滚动到元素底部刚好可见
        listContainer.scrollTop = itemBottom - containerHeight
      }
    }, [currentIndex])

    const resultMemo = React.useMemo(() => {
      if (!data || !value) return []

      // 使用新的搜索算法
      const searchResults = searchMenuWithPath(data, value)

      return searchResults.map((result) => ({
        ...result.node,
        level: result.level,
        path: result.path,
        // 添加路径信息用于显示
        pathTitles: result.path.map((p) => p.title?.toString()).filter(Boolean),
      }))
    }, [data, value])

    const handleChange = useCallback(
      (value: string) => {
        tryChangeValue(value)
      },
      [tryChangeValue]
    )

    const handleSelect = useCallback(
      (id: React.ReactText, item: MenuDataItem, index: number) => {
        setCurrentIndex(index)
        visibleAction.off()
        // 让列表容器获取焦点，确保键盘导航可用
        listRef.current?.focus()

        onSelect?.(id, item)
      },
      [onSelect, visibleAction]
    )

    const handleMove = useCallback(
      (direction: 'up' | 'down') => {
        if (!resultMemo) return

        setCurrentIndex((prev) => {
          if (direction === 'up') {
            return prev - 1 < 0 ? resultMemo?.length - 1 : prev - 1
          } else {
            return prev + 1 > resultMemo?.length - 1 ? 0 : prev + 1
          }
        })
      },
      [resultMemo]
    )

    const handleEnter = useCallback(() => {
      if (!resultMemo) return

      if (currentIndex === -1) {
        setCurrentIndex(0)
      }

      visibleAction.off()

      onSelect?.(resultMemo[currentIndex].id, resultMemo[currentIndex])
    }, [resultMemo, currentIndex, onSelect, visibleAction])

    const handleClear = useCallback(() => {
      tryChangeValue('')
      setCurrentIndex(-1)

      onClear?.()
    }, [onClear, tryChangeValue])

    const handleClose = useCallback(() => {
      visibleAction.off()
      onClose?.()
    }, [onClose, visibleAction])

    const handleEscape = useCallback(() => {
      handleClose()
      onEsc?.()
    }, [handleClose, onEsc])

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
          handleMove('up')
        }

        if (e.key === 'ArrowDown') {
          handleMove('down')
        }

        if (e.key === 'Enter') {
          handleEnter()
        }

        if (e.key === 'Escape') {
          handleEscape()
        }
      },
      [handleEnter, handleMove, handleEscape]
    )

    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null)

    useEffect(() => {
      if (!value || !inputRef) {
        visibleAction.off()
      } else {
        visibleAction.on()
      }
    }, [inputRef, value, visibleAction])

    useOutsideClick(listRef, () => {
      visibleAction.off()
    })

    useImperativeHandle(innerRef, () => {
      return {
        show: () => {
          visibleAction.on()
        },
        hide: () => {
          visibleAction.off()
        },
        focus: () => {
          inputRef?.focus()
        },
      }
    })

    const cls = cx(prefixCls, className, {
      [`${prefixCls}--open`]: visible,
    })

    return (
      <Picker
        className={cls}
        gutterGap={0}
        overlayClassName={`${prefixCls}__picker-overlay`}
        classNames={{
          container: `${prefixCls}__picker-container`,
          panel: `${prefixCls}__picker-panel`,
          body: `${prefixCls}__picker-body`,
          footer: `${prefixCls}__picker-footer`,
        }}
        styles={{
          container: {
            width,
          },
        }}
        visible={visible}
        trigger={
          <MenuSearchInput
            width={width}
            prefixCls={prefixCls}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onClear={handleClear}
            onClose={handleClose}
            onKeyDown={handleKeyDown}
            inputRef={setInputRef}
          />
        }
        footer={
          <div className={`${prefixCls}__footer`}>
            <div className={`${prefixCls}__footer-item`}>
              <div className={`${prefixCls}__footer-item__icon`}>
                <ArrowUpOutlined />
                <ArrowDownOutlined />
              </div>
              <span className={`${prefixCls}__footer-item__text`}>移动光标</span>
            </div>
            <div className={`${prefixCls}__footer-item`}>
              <div className={`${prefixCls}__footer-item__icon`}>
                <EnterIcon />
              </div>
              <span className={`${prefixCls}__footer-item__text`}>确定选择</span>
            </div>
            <div className={`${prefixCls}__footer-item`}>
              <div className={`${prefixCls}__footer-item__icon`}>esc</div>
              <span className={`${prefixCls}__footer-item__text`}>隐藏窗口</span>
            </div>
          </div>
        }
      >
        <div className={`${prefixCls}__content`}>
          <div className={`${prefixCls}__header`}>
            共搜索到 <span className={`${prefixCls}__header-count`}>{resultMemo?.length}</span>{' '}
            项与“
            <span className={`${prefixCls}__header-keyword`}>{value}</span>”相关的菜单
          </div>
          <div
            className={`${prefixCls}__list`}
            ref={listRef}
            tabIndex={-1}
            onKeyDown={handleKeyDown}
          >
            {resultMemo?.map((item, index) => {
              return (
                <div
                  key={item.id}
                  className={cx(`${prefixCls}__list-item`, {
                    [`${prefixCls}__list-item--selected`]: currentIndex === index,
                  })}
                  onClick={() => handleSelect(item.id, item, index)}
                >
                  <div className={`${prefixCls}__list-item__title`}>
                    <EllipsisTooltip
                      tooltipProps={{
                        style: {
                          maxWidth: 320,
                        },
                      }}
                    >
                      {
                        (
                          <Highlighter keyword={value}>{item.pathTitles.join('/')}</Highlighter>
                        ) as any
                      }
                    </EllipsisTooltip>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Picker>
    )
  }
)

if (__DEV__) {
  MenuSearch.displayName = 'MenuSearch'
}

export interface MenuSearchHelper {
  show: () => void
  hide: () => void
  focus: () => void
}

export interface MenuSearchProps extends HiBaseHTMLProps<'div'> {
  innerRef?: React.RefObject<MenuSearchHelper>
  clearText?: React.ReactNode
  placeholder?: string
  notFoundContent?: React.ReactNode
  width?: React.CSSProperties['width']
  visible?: boolean
  data?: MenuDataItem[]
  defaultValue?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onSelect?: (id: React.ReactText, item: MenuDataItem) => void
  onClear?: () => void
  onClose?: () => void
  onEsc?: () => void
}

export const MenuSearchInput = forwardRef<
  HTMLInputElement,
  {
    prefixCls: string
    placeholder?: string
    inputRef?: React.Dispatch<React.SetStateAction<HTMLInputElement | null>>
    width?: React.CSSProperties['width']
    value?: string
    onChange?: (value: string) => void
    onClear?: () => void
    onClose?: () => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  }
>(
  (
    {
      prefixCls,
      placeholder,
      width,
      value,
      onChange,
      onClear,
      onClose,
      onKeyDown,
      inputRef,
      ...rest
    },
    ref
  ) => {
    return (
      <div ref={ref} className={`${prefixCls}__input-wrapper`} style={{ width }}>
        <Input
          ref={inputRef}
          className={`${prefixCls}__input`}
          appearance="unset"
          placeholder={placeholder}
          prefix={<SearchOutlined />}
          suffix={
            <Button
              className={`${prefixCls}__input-clear`}
              appearance="link"
              size="xs"
              onClick={onClear}
            >
              清除
            </Button>
          }
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={onKeyDown}
          {...rest}
        />
        <span className={`${prefixCls}__close`}>
          <IconButton icon={<CloseOutlined />} effect onClick={onClose} />
        </span>
      </div>
    )
  }
)

if (__DEV__) {
  MenuSearchInput.displayName = 'MenuSearchInput'
}
