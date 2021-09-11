import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { SelectProps } from './Select'
import { useCache, useSearch } from './hooks'
import { useSelect as useSelectDefault } from '@hi-ui/use-check'
import { cx } from '@hi-ui/classname'
import { SelectItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { toArray } from '@hi-ui/use-children'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = ''

export const useSelect = ({
  data: dataProp = NOOP_ARRAY,
  children,
  disabled = false,
  value: valueProp,
  defaultValue = NOOP_VALUE,
  onChange: onChangeProp,
  onSelect,
  emptyContent = '无匹配选项',
  searchPlaceholder,
  ...rest
}: UseSelectProps) => {
  const data = useMemo(() => {
    if (children) {
      const list = toArray(children)
      const arr = []
      const dfs = (list) => {
        list.forEach((item) => {
          if (!React.isValidElement(item)) {
            return
          }

          if (item.type && item.type.HiName === 'SelectOption') {
            arr.push(item)
          } else if (item.type && item.type.HiName === 'SelectOptionGroup') {
            if (item.props && item.props.children) {
              const list = toArray(item.props.children)
              dfs(list)
            }
          }
        })
      }

      dfs(list)

      return arr.map(({ props }) => ({
        id: props.value,
        title: props.children,
        disabled: props.disabled || false,
      }))
    }
    return dataProp
  }, [children, dataProp])

  const [cacheData, setCacheData] = useCache(data)

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelectLatest = useLatestCallback(onSelect)

  const proxyTryChangeValue = useCallback(
    (value: React.ReactText, item: SelectItem) => {
      tryChangeValue(value, item)
      onSelectLatest(value, item)
    },
    [tryChangeValue, onSelectLatest]
  )

  const [onOptionClick, isSelectedId] = useSelectDefault({
    disabled,
    selectedId: value,
    onSelect: proxyTryChangeValue,
    allowSelect,
  })

  const [inSearch, matchedItems, inputProps, isEmpty, resetSearch] = useSearch(
    cacheData
    // isCanLoadChildren
    // onSearch
  )

  const getSearchInputProps = useCallback(
    () => ({
      placeholder: searchPlaceholder,
      value: inputProps.value,
      onChange: inputProps.onChange,
    }),
    [searchPlaceholder, inputProps]
  )

  const getOptionProps = useCallback(
    (props, ref) => {
      const { value: id, className, disabled = false, children, prefixCls, ...rest } = props
      const cls = cx(prefixCls, className, isSelectedId(id) && `${prefixCls}--selected`)

      return {
        ...rest,
        ref,
        className: cls,
        onClick: (e) => {
          onOptionClick({ id, disabled, title: children })
        },
      }
    },
    [onOptionClick, isSelectedId]
  )

  const rootProps = rest

  return {
    rootProps,
    data: inSearch ? matchedItems : cacheData,
    value,
    onSelect: onOptionClick,
    isSelectedId,
    emptyContent,
    getSearchInputProps,
    getOptionProps,
    tryChangeValue,
    isEmpty,
    resetSearch,
  }
}

export interface UseSelectProps extends SelectProps {}

export type UseSelectReturn = ReturnType<typeof useSelect>

const allowSelect = (option: any) => !option.disabled
