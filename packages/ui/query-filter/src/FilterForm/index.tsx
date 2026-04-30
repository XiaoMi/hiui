import React, { ReactText, useEffect, useRef } from 'react'
import { useLocaleContext } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import Form, { FormProps, FormHelpers } from '@hi-ui/form'
import Tooltip from '@hi-ui/tooltip'
import Button from '@hi-ui/button'
import { PinOutlined } from '@hi-ui/icons'
import { useFilterContext } from '../context'

const prefixCls = getPrefixCls('query-filter-form')

export const FilterForm: React.FC<FilterFormProps> = ({
  styles = {},
  classNames,
  filterFields,
  formData,
  onChange,
  onPinChange,
  placement = 'horizontal',
  showLabel = true,
  showPin = true,
  appearance = 'line',
  gap = 8,
  prepend,
  append,
  pinTexts = {
    pin: '',
    unpin: '',
  },
  onDataChange,
  customFieldProps,
}) => {
  const formRef = useRef<FormHelpers>(null)

  useEffect(() => {
    formRef.current?.setFieldsValue(formData)
  }, [formData])

  const prependList = prepend ? (Array.isArray(prepend) ? prepend : [prepend]) : []
  const appendList = append ? (Array.isArray(append) ? append : [append]) : []

  return (
    <div className={`${prefixCls}-wrapper`}>
      <Form
        style={{ '--filter-form-gap': `${gap}px`, ...styles?.form } as React.CSSProperties}
        className={cx(`${prefixCls}`, classNames?.form)}
        innerRef={formRef}
        initialValues={formData}
        onValuesChange={onChange}
        labelPlacement="top"
        placement={placement}
        showValidateMessage={placement === 'vertical'}
      >
        {prependList.map((item, index) => (
          <Form.Item key={index}>{item}</Form.Item>
        ))}
        {filterFields.map((item) => (
          <FilterField
            key={item.field}
            item={item}
            showLabel={showLabel}
            showPin={showPin}
            pinTexts={pinTexts}
            appearance={appearance}
            onPinChange={onPinChange}
            onDataChange={onDataChange}
            customFieldProps={customFieldProps}
          />
        ))}
        {appendList.map((item, index) => (
          <Form.Item key={index}>{item}</Form.Item>
        ))}
      </Form>
    </div>
  )
}

export interface FilterFieldProps {
  /**
   * 字段名
   */
  field: string
  /**
   * 标签
   */
  label: React.ReactNode
  /**
   * 组件
   */
  component: React.ReactElement
  /**
   * 选项
   */
  options?: {
    id: ReactText
    title: string
  }[]
  /**
   * 是否可见
   */
  visible?: boolean
}

export interface FilterFormProps {
  /**
   * 语义化结构 style
   */
  styles?: {
    form?: React.CSSProperties
  }
  /**
   * 语义化结构 class
   */
  classNames?: {
    form?: string
  }
  /**
   * 筛选字段
   */
  filterFields: FilterFieldProps[]
  /**
   * 表单数据
   */
  formData: Record<string, unknown>
  /**
   * 表单数据变化回调
   */
  onChange?: FormProps['onValuesChange']
  /**
   * 固定字段变化回调
   */
  onPinChange?: (field: string, visible: boolean) => void
  /**
   * 布局方式
   */
  placement?: FormProps['placement']
  /**
   * 是否显示标签
   */
  showLabel?: boolean
  /**
   * 是否显示固定字段
   */
  showPin?: boolean
  /**
   * 外观
   */
  appearance?: 'line' | 'contained'
  /**
   * 间距
   */
  gap?: number
  /**
   * 前置内容
   */
  prepend?: React.ReactNode | React.ReactNode[]
  /**
   * 后置内容
   */
  append?: React.ReactNode | React.ReactNode[]
  /**
   * 固定字段文本
   */
  pinTexts?: {
    pin: string
    unpin: string
  }
  /**
   * 数据变化回调
   */
  onDataChange?: (
    field: string,
    value: React.ReactText | React.ReactText[],
    item: unknown,
    items: unknown[]
  ) => void
  /**
   * 自定义字段属性
   */
  customFieldProps?: (filterField: FilterFieldProps) => Record<string, unknown> | undefined
}

export const updateSelectedCacheData = (
  selectedCacheData: Map<string, unknown[]>,
  field: string,
  value: React.ReactText | React.ReactText[],
  item: unknown,
  items: unknown[]
) => {
  const newSelectedCacheData = new Map(selectedCacheData)

  if (!value || (Array.isArray(value) && value.length === 0)) {
    newSelectedCacheData.set(field, [])
  } else {
    if (Array.isArray(value) && items) {
      newSelectedCacheData.set(field, [...items])
    } else {
      newSelectedCacheData.set(field, [item])
    }
  }

  return newSelectedCacheData
}

export const useCacheSelectedData = (): {
  cacheSelectedData: (
    field: string,
    value: React.ReactText | React.ReactText[],
    item: unknown,
    items: unknown[]
  ) => void
} => {
  const { selectedCacheData, setSelectedCacheData } = useFilterContext()

  const cacheSelectedData = (
    field: string,
    value: React.ReactText | React.ReactText[],
    item: unknown,
    items: unknown[]
  ) => {
    const newSelectedCacheData = updateSelectedCacheData(
      selectedCacheData,
      field,
      value,
      item,
      items
    )
    setSelectedCacheData(newSelectedCacheData)
  }

  return {
    cacheSelectedData,
  }
}

function FilterField({
  item,
  showLabel,
  showPin,
  pinTexts,
  onPinChange,
  appearance,
  onDataChange,
  customFieldProps,
}: {
  item: FilterFieldProps
  appearance: 'line' | 'contained'
  showLabel: boolean
  showPin: boolean
  pinTexts: {
    pin: string
    unpin: string
  }
  onPinChange?: (field: string, visible: boolean) => void
  onDataChange?: FilterFormProps['onDataChange']
  customFieldProps?: (filterField: FilterFieldProps) => Record<string, unknown> | undefined
}) {
  const { field, label, component, visible } = item
  const { selectedCacheData } = useFilterContext()
  const i18n = useLocaleContext()

  const dataMemo = React.useMemo(() => {
    const dataProp = component?.props?.data
    // 去重后的数据
    const data = dataProp?.filter((item: unknown) => !selectedCacheData.get(field)?.includes(item))

    return component?.props?.dataSource
      ? (selectedCacheData.get(field) || []).concat(data || [])
      : dataProp
  }, [selectedCacheData, field, component])

  return (
    <div key={field} className={`${prefixCls}-item`}>
      <Form.Item
        key={field}
        field={field}
        label={showLabel ? label : ''}
        className={`${prefixCls}-item-form`}
      >
        {React.cloneElement(component as React.ReactElement, {
          // Todo：因为 Input 组件目前 appearance 没有 'contained' 类型，所以这里先特殊处理
          appearance:
            appearance === 'contained'
              ? (component as React.ReactElement).props.appearance || 'contained'
              : 'line',
          ...(appearance === 'contained' ? { label } : {}),
          data: dataMemo,
          onChange: (
            value: React.ReactText | React.ReactText[],
            item: unknown,
            items: unknown[]
          ) => {
            component?.props?.onChange?.(value, item, items)

            onDataChange?.(field, value, item, items)
          },
          ...customFieldProps?.(item),
        })}
      </Form.Item>
      {showPin && (
        <Tooltip
          title={
            visible
              ? pinTexts?.unpin || i18n.get('queryFilter.unpin')
              : pinTexts?.pin || i18n.get('queryFilter.pin')
          }
          placement="left"
          gutterGap={9}
        >
          <Button
            className={`${prefixCls}-item-pin-btn`}
            size="sm"
            type={visible ? 'primary' : 'default'}
            appearance="text"
            icon={<PinOutlined size={16} />}
            onClick={() => onPinChange?.(field, !visible)}
          />
        </Tooltip>
      )}
    </div>
  )
}
