import React from 'react'
import { resolveArray } from './core'

function toSchemaValueType(type: unknown) {
  if (type === 'number') return 'number'
  if (type === 'select') return 'select'
  if (type === 'date' || type === 'dateRange') return 'date'
  if (type === 'switch') return 'switch'
  if (type === 'radio') return 'radio'
  if (type === 'checkbox') return 'checkbox'
  if (type === 'textarea') return 'textarea'
  return 'text'
}

function toSchemaFormRules(field: Record<string, unknown>, validationRules: Record<string, unknown>) {
  const dataIndex = String(field.name || '')
  const rules = resolveArray<Record<string, unknown>>(validationRules[dataIndex])
  const requiredRule = field.required === true
    ? [{ required: true, message: `请填写${String(field.label || field.name || '该字段')}` }]
    : []

  return [...requiredRule, ...rules]
}

function toSchemaOptions(field: Record<string, unknown>) {
  return resolveArray<Record<string, unknown>>(field.options).map((option) => ({
    id: option.value ?? option.id,
    title: option.label ?? option.title ?? option.value ?? option.id,
  }))
}

function toSchemaFormField(field: Record<string, unknown>, index: number, validationRules: Record<string, unknown>) {
  const dataIndex = String(field.name || field.dataIndex || `field_${index}`)
  const title = String(field.label || field.title || dataIndex)
  const options = toSchemaOptions(field)
  const rules = toSchemaFormRules({ ...field, name: dataIndex }, validationRules)

  return {
    title,
    _titleText: title,
    dataIndex,
    key: dataIndex,
    valueType: toSchemaValueType(field.type),
    renderer: {},
    fieldProps: {
      placeholder: field.placeholder,
      data: options.length > 0 ? options : undefined,
    },
    formItemProps: {
      required: field.required === true,
      rules: rules.length > 0 ? rules : undefined,
    },
    control: {
      required: field.required === true,
    },
  }
}

export function resolveFormFields(value: unknown, validationRules: unknown = {}) {
  const normalizedRules = validationRules && typeof validationRules === 'object' ? validationRules as Record<string, unknown> : {}
  return resolveArray<Record<string, unknown>>(value).map((field, index) => toSchemaFormField(field, index, normalizedRules))
}

export function renderFormFields(value: unknown) {
  const fields = resolveFormFields(value)
  if (fields.length === 0) return null

  return (
    <div className="hiui-legacy-form-grid" data-hiui-legacy-region="form-body">
      {fields.map((field, index) => (
        <div className="hiui-legacy-field-row" key={String(field.key || index)} data-hiui-legacy-field-type={String(field.valueType)}>
          <span className="hiui-legacy-field-label">
            {(field.control as Record<string, unknown> | undefined)?.required === true ? <span className="hiui-legacy-required">*</span> : null}
            {String(field.title || `字段${index + 1}`)}
          </span>
          <span className="hiui-legacy-field-value" data-hiui-legacy-field-name={String(field.dataIndex)} />
        </div>
      ))}
    </div>
  )
}
