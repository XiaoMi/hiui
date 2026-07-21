import React, { useContext, useEffect, useMemo, useState } from 'react'
import {
  Button,
  CheckSelect,
  DatePicker,
  Input,
  PageHeader,
  Select,
  Textarea,
} from '@hi-ui/hiui'
import { useHostAdapter } from '../../host/useHostAdapter'
import styles from './CanonicalFullPageEditPage.module.scss'

type SelectOption =
  | string
  | {
      id: string | number
      title: string
    }

export type EditField = {
  key: string
  label: string
  type?: 'text' | 'number' | 'textarea' | 'select' | 'date' | 'dateTime' | 'checkSelect'
  placeholder?: string
  defaultValue?: string | string[]
  options?: SelectOption[]
}

export type EditSection = {
  title: string
  fields: EditField[]
}

export type FullPageEditSchema = {
  pageType: 'full-page-edit'
  title: string
  draftMessage?: string
  submitMessage?: string
  sections: EditSection[]
}

type EditFieldValue = string | number | string[] | Date | null

type ProEditPageContextValue = {
  formValues: Record<string, EditFieldValue>
  setFieldValue: (key: string, value: EditFieldValue) => void
  onCancel: () => void
  onStash: () => Promise<void>
  onSubmit: () => Promise<void>
  isReady: boolean
}

type ProEditPageProviderProps = {
  detailRequest: () => Promise<Record<string, EditFieldValue>>
  cancelRequest: () => void
  submitRequest: () => Promise<void>
  stashRequest: () => Promise<void>
  children?: React.ReactNode
}

type FormProps = {
  sections: EditSection[]
  borderedGroups?: boolean
  formProps?: {
    labelPlacement?: 'top' | 'left' | 'right'
  }
  gridProps?: {
    columnCount?: number
    gutter?: number
  }
}

const ProEditPageContext = React.createContext<ProEditPageContextValue>({
  formValues: {},
  setFieldValue: () => undefined,
  onCancel: () => undefined,
  onStash: async () => undefined,
  onSubmit: async () => undefined,
  isReady: false,
})

const proEditPageShellStyles = {
  formScrollBody: styles.formScrollBody,
  inlineEditFooter: styles.inlineEditFooter,
}

function joinClassNames(...classNames: Array<string | undefined | false | null>) {
  return classNames.filter(Boolean).join(' ')
}

function normalizeOptions(options: SelectOption[] = []) {
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

function buildInitialValues(schema: FullPageEditSchema) {
  return schema.sections.reduce<Record<string, EditFieldValue>>((acc, section) => {
    section.fields.forEach((field) => {
      if (field.type === 'checkSelect') {
        acc[field.key] = Array.isArray(field.defaultValue) ? field.defaultValue : []
        return
      }

      if (field.type === 'date' || field.type === 'dateTime') {
        acc[field.key] = null
        return
      }

      acc[field.key] = Array.isArray(field.defaultValue) ? field.defaultValue.join(', ') : field.defaultValue || ''
    })
    return acc
  }, {})
}

function TypicalPageHeaderPortal({ children }: { children?: React.ReactNode }) {
  return <div className={styles.headerPortal}>{children}</div>
}

function useProEditPageContext() {
  return useContext(ProEditPageContext)
}

function ProEditPageProvider({
  detailRequest,
  cancelRequest,
  submitRequest,
  stashRequest,
  children,
}: ProEditPageProviderProps) {
  const [formValues, setFormValues] = useState<Record<string, EditFieldValue>>({})
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const nextValues = await detailRequest()
      if (cancelled) {
        return
      }

      setFormValues(nextValues)
      setIsReady(true)
    }

    hydrate()

    return () => {
      cancelled = true
    }
  }, [detailRequest])

  const contextValue = useMemo<ProEditPageContextValue>(
    () => ({
      formValues,
      setFieldValue: (key, value) => {
        setFormValues((prev) => ({
          ...prev,
          [key]: value,
        }))
      },
      onCancel: () => {
        cancelRequest()
      },
      onStash: async () => {
        await stashRequest()
      },
      onSubmit: async () => {
        await submitRequest()
      },
      isReady,
    }),
    [cancelRequest, formValues, isReady, stashRequest, submitRequest]
  )

  return <ProEditPageContext.Provider value={contextValue}>{children}</ProEditPageContext.Provider>
}

function renderFieldControl(
  field: EditField,
  value: EditFieldValue,
  setFieldValue: (key: string, value: EditFieldValue) => void
) {
  if (field.type === 'select') {
    return (
      <Select
        appearance="contained"
        clearable
        searchable
        data={normalizeOptions(field.options)}
        value={(value as string | number | undefined) ?? ''}
        placeholder={field.placeholder || `请选择${field.label}`}
        onChange={(nextValue) => setFieldValue(field.key, (nextValue ?? '') as string)}
      />
    )
  }

  if (field.type === 'checkSelect') {
    return (
      <CheckSelect
        searchable
        showCheckAll
        data={normalizeOptions(field.options)}
        value={Array.isArray(value) ? (value as string[]) : []}
        placeholder={field.placeholder || `请选择${field.label}`}
        onChange={(nextValue) => setFieldValue(field.key, (nextValue as string[]) || [])}
      />
    )
  }

  if (field.type === 'date' || field.type === 'dateTime') {
    return (
      <DatePicker
        appearance="filled"
        clearable
        showTime={field.type === 'dateTime'}
        format={field.type === 'dateTime' ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
        value={value instanceof Date ? value : undefined}
        placeholder={field.placeholder || `请选择${field.label}`}
        onChange={(nextValue) => setFieldValue(field.key, (nextValue as Date | null) ?? null)}
      />
    )
  }

  if (field.type === 'textarea') {
    return (
      <Textarea
        rows={4}
        value={String(value ?? '')}
        placeholder={field.placeholder || `请输入${field.label}`}
        onChange={(event) => setFieldValue(field.key, event.target.value)}
      />
    )
  }

  return (
    <Input
      appearance="filled"
      type={field.type === 'number' ? 'number' : 'text'}
      value={String(value ?? '')}
      placeholder={field.placeholder || `请输入${field.label}`}
      onChange={(event) => setFieldValue(field.key, event.target.value)}
    />
  )
}

function Form({
  sections,
  borderedGroups = false,
  formProps,
  gridProps,
}: FormProps) {
  const { formValues, setFieldValue, isReady } = useProEditPageContext()
  const columnCount = gridProps?.columnCount || 3

  if (!isReady) {
    return <div className={styles.loadingCard}>表单加载中...</div>
  }

  return (
    <div className={styles.editLayout}>
      {sections.map((section) => (
        <section
          key={section.title}
          className={joinClassNames(
            styles.formSection,
            borderedGroups ? styles.formSectionCard : styles.formSectionPlain
          )}
        >
          <div className={styles.sectionTitle}>{section.title}</div>
          <div
            className={styles.sectionGrid}
            style={{
              gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              columnGap: gridProps?.gutter ?? 40,
            }}
          >
            {section.fields.map((field) => {
              const isWide = field.type === 'textarea'

              return (
                <label
                  key={field.key}
                  className={joinClassNames(
                    styles.field,
                    isWide && styles.fieldWide,
                    formProps?.labelPlacement === 'top' && styles.fieldLabelTop
                  )}
                >
                  <span className={styles.fieldLabel}>{field.label}</span>
                  {renderFieldControl(field, formValues[field.key], setFieldValue)}
                </label>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

function CancelButton() {
  const { onCancel } = useProEditPageContext()

  return <Button onClick={onCancel}>取消</Button>
}

function StashButton() {
  const { onStash } = useProEditPageContext()

  return (
    <Button type="primary" appearance="line" onClick={() => void onStash()}>
      暂存
    </Button>
  )
}

function SubmitButton({ children }: { children?: React.ReactNode }) {
  const { onSubmit } = useProEditPageContext()

  return (
    <Button type="primary" onClick={() => void onSubmit()}>
      {children || '提交'}
    </Button>
  )
}

function ProEditPage({ children }: { children?: React.ReactNode }) {
  return <div className={styles.proEditPage}>{children}</div>
}

export function CanonicalFullPageEditPage({
  schema,
  className,
}: {
  schema: FullPageEditSchema
  className?: string
}) {
  const hostAdapter = useHostAdapter()
  const initialValues = useMemo(() => buildInitialValues(schema), [schema])

  const detailRequest = useMemo(
    () => async () => initialValues,
    [initialValues]
  )

  const stashRequest = useMemo(
    () => async () => {
      hostAdapter.message.success(schema.draftMessage || '草稿已暂存（示例）')
    },
    [hostAdapter.message, schema.draftMessage]
  )

  const submitRequest = useMemo(
    () => async () => {
      hostAdapter.message.success(schema.submitMessage || '全页编辑已提交（示例）')
    },
    [hostAdapter.message, schema.submitMessage]
  )

  const cancelRequest = () => {
    hostAdapter.message.warning('已取消编辑（示例）')
  }

  return (
    <div
      className={joinClassNames(styles.pageRoot, className)}
      data-hiui-pagegen-template="full-page-edit"
      data-hiui5-page-type="full-page-edit"
      data-hiui5-shell="hiui-pagegen-full-page-edit-v1"
    >
      <ProEditPageProvider
        detailRequest={detailRequest}
        cancelRequest={cancelRequest}
        submitRequest={submitRequest}
        stashRequest={stashRequest}
      >
        <ProEditPage>
          <TypicalPageHeaderPortal>
            <PageHeader title={schema.title} backIcon={false} />
          </TypicalPageHeaderPortal>

          <div className={proEditPageShellStyles.formScrollBody}>
            <Form
              sections={schema.sections}
              borderedGroups={false}
              formProps={{ labelPlacement: 'top' }}
              gridProps={{
                columnCount: 3,
                gutter: 40,
              }}
            />
          </div>

          <div className={proEditPageShellStyles.inlineEditFooter}>
            <div className={styles.footerActions}>
              <CancelButton />
              <StashButton />
              <SubmitButton>提交</SubmitButton>
            </div>
          </div>
        </ProEditPage>
      </ProEditPageProvider>
    </div>
  )
}

export default CanonicalFullPageEditPage
