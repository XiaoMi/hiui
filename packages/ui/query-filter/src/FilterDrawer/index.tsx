import React, { useEffect, useRef, useState } from 'react'
import { useLocaleContext } from '@hi-ui/core'
import { getPrefixCls } from '@hi-ui/classname'
import Drawer, { DrawerProps } from '@hi-ui/drawer'
import { Button } from '@hi-ui/button'
import {
  FilterForm,
  FilterFieldProps,
  FilterFormProps,
  updateSelectedCacheData,
} from '../FilterForm'
import { useFilterContext } from '../context'

const prefixCls = getPrefixCls('query-filter-drawer')

export const FilterDrawer: React.FC<
  Omit<FilterFormProps, 'onChange' | 'placement'> & {
    onChange?: (formData: Record<string, unknown>, fields: FilterFieldProps[]) => void
    sureText?: React.ReactNode
    cancelText?: React.ReactNode
  } & DrawerProps & {
      onSelect?: (
        val: Record<string, unknown>,
        allVals: Record<string, unknown>,
        filterField?: FilterFieldProps
      ) => void
    }
> = ({
  filterFields: propsFilterFields,
  formData: propsFormData,
  onChange,
  onPinChange,
  onSelect,
  title,
  sureText,
  cancelText,
  visible: visibleProp,
  pinTexts,
  onClose,
  customFieldProps,
  ...restProps
}) => {
  const [formData, setFormData] = useState(propsFormData)
  const [visible, setVisible] = useState(visibleProp)
  const [filterFields, setFilterFields] = useState(propsFilterFields)

  const i18n = useLocaleContext()
  const { selectedCacheData, setSelectedCacheData } = useFilterContext()

  const originSelectedCacheData = useRef(selectedCacheData)
  const newSelectedCacheData = useRef(selectedCacheData)

  useEffect(() => {
    originSelectedCacheData.current = new Map(selectedCacheData)
  }, [selectedCacheData])

  useEffect(() => {
    setFormData(propsFormData)
  }, [propsFormData])

  useEffect(() => {
    setVisible(visibleProp)
  }, [visibleProp])

  useEffect(() => {
    setFilterFields(propsFilterFields)
  }, [propsFilterFields])

  const handleChange = (val: Record<string, unknown>, allVals: Record<string, unknown>) => {
    setFormData(allVals)
    onSelect?.(
      val,
      allVals,
      filterFields.find((item) => item.field === Object.keys(val)[0])
    )
  }

  const handleConfirm = () => {
    setVisible(false)
    onClose?.()
    onChange?.(formData, filterFields)

    setSelectedCacheData(new Map(newSelectedCacheData.current))
  }

  const handlePinChange = (field: string, visible: boolean) => {
    const newFields = filterFields.map((item) => {
      if (item.field === field) {
        return { ...item, visible }
      }
      return item
    })
    setFilterFields(newFields)

    onPinChange?.(field, visible)
  }

  const handleReset = () => {
    setFormData(propsFormData)
    setFilterFields(propsFilterFields)
    setSelectedCacheData(new Map(originSelectedCacheData.current))
  }

  const handleClose = () => {
    setVisible(false)
    onClose?.()

    handleReset()
  }

  return (
    <Drawer
      className={prefixCls}
      title={title}
      footer={
        <div className={`${prefixCls}-footer`} style={{ textAlign: 'right' }}>
          <Button appearance="line" onClick={handleClose}>
            {cancelText || i18n.get('modal.cancelText')}
          </Button>
          <Button type="primary" onClick={handleConfirm}>
            {sureText || i18n.get('modal.confirmText')}
          </Button>
        </div>
      }
      visible={visible}
      onClose={handleClose}
      {...restProps}
    >
      <FilterForm
        placement="vertical"
        appearance="line"
        filterFields={filterFields}
        formData={formData}
        onChange={handleChange}
        onPinChange={handlePinChange}
        pinTexts={pinTexts}
        onDataChange={(field, value, item, items) => {
          newSelectedCacheData.current = updateSelectedCacheData(
            originSelectedCacheData.current,
            field,
            value,
            item,
            items
          )
        }}
        customFieldProps={customFieldProps}
      />
    </Drawer>
  )
}
