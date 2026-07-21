import React, { useMemo, useState } from 'react'
import {
  Button,
  DatePicker,
  Drawer,
  Input,
  PageHeader,
  Select,
  Textarea,
} from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalDrawerFormPage.module.scss'

type SelectOption =
  | string
  | {
      id: string | number
      title: string
    }

export type DrawerFormField = {
  key: string
  label: string
  type?: 'text' | 'number' | 'textarea' | 'select' | 'date'
  placeholder?: string
  defaultValue?: string
  options?: SelectOption[]
}

export type DrawerFormSection = {
  title: string
  fields: DrawerFormField[]
}

export type DrawerFormSchema = {
  pageType: 'drawer-form'
  title: string
  drawerTitle: string
  submitMessage?: string
  cancelMessage?: string
  sections: DrawerFormSection[]
}

type FormFieldValue = string | number | Date | null

type SchemaFormProps<T extends Record<string, FormFieldValue>> = {
  fields: DrawerFormSection[]
  values: T
  onChange: <K extends keyof T>(key: K, value: T[K]) => void
  borderedGroups?: boolean
  grid?: boolean
  column?: number
  formProps?: {
    labelPlacement?: 'top' | 'left' | 'right'
  }
  gridProps?: {
    columnCount?: number
    gutter?: number
    rowGap?: number
  }
}

type ProFormDrawerProps = {
  title: string
  visible: boolean
  width?: number
  closeable?: boolean
  unmountOnClose?: boolean
  onClose: () => void
  footer?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

function joinClassNames(...classNames: Array<string | undefined | false | null>) {
  return classNames.filter(Boolean).join(' ')
}

function normalizeSelectOptions(options: SelectOption[] = []) {
  return options.map((option) => {
    if (typeof option === 'string') {
      return {
        id: option,
        title: option,
      }
    }

    return option
  })
}

function buildInitialValues(schema: DrawerFormSchema) {
  return schema.sections.reduce<Record<string, FormFieldValue>>((acc, section) => {
    section.fields.forEach((field) => {
      acc[field.key] = field.type === 'date' ? null : field.defaultValue || ''
    })
    return acc
  }, {})
}

function renderFieldControl<T extends Record<string, FormFieldValue>>(
  field: DrawerFormField,
  value: T[keyof T],
  onChange: <K extends keyof T>(key: K, value: T[K]) => void
) {
  if (field.type === 'select') {
    return (
      <Select
        appearance="contained"
        clearable
        data={normalizeSelectOptions(field.options)}
        value={(value as string | number | undefined) ?? ''}
        placeholder={field.placeholder || `请选择${field.label}`}
        onChange={(nextValue) => onChange(field.key as keyof T, (nextValue ?? '') as T[keyof T])}
      />
    )
  }

  if (field.type === 'date') {
    return (
      <DatePicker
        appearance="filled"
        clearable
        format="YYYY-MM-DD"
        value={value instanceof Date ? value : undefined}
        placeholder={field.placeholder || `请选择${field.label}`}
        onChange={(nextValue) =>
          onChange(field.key as keyof T, ((nextValue as Date | null) ?? null) as T[keyof T])
        }
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <Textarea
        rows={4}
        value={String(value ?? '')}
        placeholder={field.placeholder || `请输入${field.label}`}
        onChange={(event) => onChange(field.key as keyof T, event.target.value as T[keyof T])}
      />
    )
  }

  return (
    <Input
      appearance="filled"
      type={field.type === 'number' ? 'number' : 'text'}
      value={String(value ?? '')}
      placeholder={field.placeholder || `请输入${field.label}`}
      onChange={(event) => onChange(field.key as keyof T, event.target.value as T[keyof T])}
    />
  )
}

function TypicalPageHeaderPortal({ children }: { children?: React.ReactNode }) {
  return <div className={styles.headerPortal}>{children}</div>
}

function TypicalPageFieldMapProvider({ children }: { children?: React.ReactNode }) {
  return <div className={styles.fieldMapProvider}>{children}</div>
}

function ProDrawerFooterActions({ children }: { children?: React.ReactNode }) {
  return <div className={styles.footerActions}>{children}</div>
}

function ProFormDrawer({
  title,
  visible,
  width = 600,
  closeable,
  unmountOnClose,
  onClose,
  footer,
  className,
  children,
}: ProFormDrawerProps) {
  return (
    <Drawer
      title={title}
      visible={visible}
      width={width}
      onClose={onClose}
      footer={footer}
      className={joinClassNames(styles.proFormDrawer, className)}
      closeIcon={closeable === false ? null : undefined}
      destroyOnClose={unmountOnClose}
    >
      <div className={styles.drawerBody}>{children}</div>
    </Drawer>
  )
}

function SchemaForm<T extends Record<string, FormFieldValue>>({
  fields,
  values,
  onChange,
  borderedGroups = true,
  grid = false,
  column = 2,
  formProps,
  gridProps,
}: SchemaFormProps<T>) {
  const columnCount = gridProps?.columnCount || column || 2
  const gridStyle: React.CSSProperties = grid
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        columnGap: gridProps?.gutter ?? 24,
        rowGap: gridProps?.rowGap ?? 16,
      }
    : {}

  return (
    <div className={styles.schemaForm}>
      {fields.map((section) => (
        <section
          key={section.title}
          className={joinClassNames(
            styles.formSection,
            borderedGroups ? styles.formSectionCard : styles.formSectionPlain
          )}
        >
          <div className={styles.sectionTitle}>{section.title}</div>
          <div className={styles.sectionGrid} style={gridStyle}>
            {section.fields.map((field) => {
              const isWide = field.type === 'textarea'
              const labelPlacement = formProps?.labelPlacement || 'top'

              return (
                <label
                  key={field.key}
                  className={joinClassNames(
                    styles.field,
                    isWide && styles.fieldWide,
                    labelPlacement === 'top' && styles.fieldLabelTop
                  )}
                >
                  <span className={styles.fieldLabel}>{field.label}</span>
                  {renderFieldControl(field, values[field.key], onChange)}
                </label>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export function CanonicalDrawerFormPage({
  schema,
  className,
}: {
  schema: DrawerFormSchema
  className?: string
}) {
  const hostAdapter = useHostAdapter()
  const initialValues = useMemo(() => buildInitialValues(schema), [schema])
  const [visible, setVisible] = useState(true)
  const [formValues, setFormValues] = useState<Record<string, FormFieldValue>>(initialValues)

  const handleFieldChange = <K extends string>(key: K, value: FormFieldValue) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleOpen = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
    hostAdapter.message.warning(schema.cancelMessage || '已取消编辑（示例）')
  }

  const handleSubmit = () => {
    hostAdapter.message.success(schema.submitMessage || '抽屉表单已提交（示例）')
    setVisible(false)
  }

  return (
    <div
      className={joinClassNames(styles.pageRoot, className)}
      data-hiui-pagegen-template="drawer-form"
      data-hiui5-page-type="drawer-form"
      data-hiui5-shell="hiui-pagegen-drawer-form-v1"
    >
      <TypicalPageHeaderPortal>
        <PageHeader
          title={schema.title}
          backIcon={false}
          extra={
            <Button type="primary" onClick={handleOpen}>
              打开抽屉
            </Button>
          }
        />
      </TypicalPageHeaderPortal>

      <div className={styles.placeholderStage}>
        <Button type="primary" onClick={handleOpen}>
          打开抽屉表单
        </Button>
      </div>

      <ProFormDrawer
        title={schema.drawerTitle}
        visible={visible}
        width={600}
        closeable
        unmountOnClose={false}
        onClose={handleClose}
        footer={
          <ProDrawerFooterActions>
            <Button onClick={handleClose}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>
              确认
            </Button>
          </ProDrawerFooterActions>
        }
      >
        <TypicalPageFieldMapProvider>
          <SchemaForm<Record<string, FormFieldValue>>
            fields={schema.sections}
            values={formValues}
            onChange={handleFieldChange}
            borderedGroups={false}
            grid
            column={2}
            formProps={{ labelPlacement: 'top' }}
            gridProps={{
              columnCount: 2,
              gutter: 32,
              rowGap: 0,
            }}
          />
        </TypicalPageFieldMapProvider>
      </ProFormDrawer>
    </div>
  )
}

export default CanonicalDrawerFormPage
