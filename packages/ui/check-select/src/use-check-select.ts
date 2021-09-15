import React, { useCallback, useMemo } from 'react'
import { useUncontrolledState } from '@hi-ui/use-uncontrolled-state'
import { CheckSelectProps } from './CheckSelect'
import { useSearch } from './hooks'
import { useCheck as useCheckDefault } from '@hi-ui/use-check'
import { CheckSelectItem } from './types'
import { useLatestCallback } from '@hi-ui/use-latest'
import { toArray } from '@hi-ui/use-children'

const NOOP_ARRAY = [] as []
const NOOP_VALUE = [] as []

export const useCheckSelect = ({
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
      const arr: any[] = []
      const dfs = (list: any[]) => {
        list.forEach((item) => {
          if (!React.isValidElement(item)) return

          // @ts-ignore
          if (item.type && item.type.HiName === 'CheckSelectOption') {
            arr.push(item)
            // @ts-ignore
          } else if (item.type && item.type.HiName === 'CheckSelectOptionGroup') {
            // @ts-ignore
            if (item.props && item.props.children) {
              // @ts-ignore
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

  const [value, tryChangeValue] = useUncontrolledState(defaultValue, valueProp, onChangeProp)

  const onSelectLatest = useLatestCallback(onSelect)

  const proxyTryChangeValue = useCallback(
    (value: React.ReactText[], item: CheckSelectItem, shouldChecked: boolean) => {
      tryChangeValue(value, item, shouldChecked)
      onSelectLatest(value, item, shouldChecked)
    },
    [tryChangeValue, onSelectLatest]
  )

  const [onOptionCheck, isSelectedId] = useCheckDefault({
    disabled,
    checkedIds: value,
    onCheck: proxyTryChangeValue,
    allowCheck,
  })

  const [inSearch, matchedItems, inputProps, isEmpty, resetSearch] = useSearch(data)

  const getSearchInputProps = useCallback(
    () => ({
      placeholder: searchPlaceholder,
      value: inputProps.value,
      onChange: inputProps.onChange,
    }),
    [searchPlaceholder, inputProps]
  )

  return {
    rootProps: rest,
    data: inSearch ? matchedItems : data,
    value,
    onSelect: onOptionCheck,
    isSelectedId,
    emptyContent,
    getSearchInputProps,
    tryChangeValue,
    isEmpty,
    resetSearch,
  }
}

export interface UseSelectProps extends CheckSelectProps {}

export type UseSelectReturn = ReturnType<typeof useCheckSelect>

const allowCheck = (option: any) => !option.disabled
