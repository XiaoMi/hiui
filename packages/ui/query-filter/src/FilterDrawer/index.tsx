import React, { useEffect, useRef, useState } from 'react'
import { useLocaleContext, useGlobalContext } from '@hi-ui/core'
import { cx, getPrefixCls } from '@hi-ui/classname'
import Drawer, { DrawerProps } from '@hi-ui/drawer'
import { Button } from '@hi-ui/button'
import {
  FilterForm,
  FilterFieldProps,
  FilterFormProps,
  updateSelectedCacheData,
} from '../FilterForm'
import { useFilterContext } from '../context'
import { useMergeSemantic } from '@hi-ui/use-merge-semantic'
import type {
  ComponentSemantic,
  SemanticClassNamesType,
  SemanticStylesType,
} from '@hi-ui/use-merge-semantic'

const prefixCls = getPrefixCls('query-filter-drawer')

export type FilterDrawerSemanticName = 'root' | 'footer'
export type FilterDrawerSemanticClassNames = SemanticClassNamesType<
  FilterDrawerProps,
  FilterDrawerSemanticName
>
export type FilterDrawerSemanticStyles = SemanticStylesType<
  FilterDrawerProps,
  FilterDrawerSemanticName
>
export type FilterDrawerSemantic = ComponentSemantic<
  FilterDrawerSemanticClassNames,
  FilterDrawerSemanticStyles
>
export type FilterDrawerProps = Omit<FilterFormProps, 'onChange' | 'placement'> & {
  onChange?: (formData: Record<string, unknown>, fields: FilterFieldProps[]) => void
  sureText?: React.ReactNode
  cancelText?: React.ReactNode
} & DrawerProps & {
    onSelect?: (
      val: Record<string, unknown>,
      allVals: Record<string, unknown>,
      filterField?: FilterFieldProps
    ) => void
  } & FilterDrawerSemantic

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
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
  classNames: classNamesProp,
  styles: stylesProp,
  ...restProps
}) => {
  const { filterDrawer: filterDrawerConfig } = useGlobalContext()
  const { classNames, styles } = useMergeSemantic<
    FilterDrawerSemanticClassNames,
    FilterDrawerSemanticStyles,
    FilterDrawerProps
  >({
    classNamesList: [filterDrawerConfig?.classNames, classNamesProp],
    stylesList: [filterDrawerConfig?.styles, stylesProp],
    info: {
      props: {
        ...restProps,
        title,
        visible: visibleProp,
        filterFields: propsFilterFields,
        formData: propsFormData,
      },
    },
  })
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
      classNames={{ root: classNames?.root, footer: classNames?.footer }}
      styles={{ root: styles?.root, footer: styles?.footer }}
      title={title}
      footer={
        <div
          className={cx(`${prefixCls}-footer`, classNames?.footer)}
          style={{ textAlign: 'right', ...styles?.footer }}
        >
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
