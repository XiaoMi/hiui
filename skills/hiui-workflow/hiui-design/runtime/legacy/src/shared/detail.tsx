import React from 'react'
import { D } from '@hi-ui/schema-core'
import { SchemaDescriptionsBridge } from '@hi-ui/schema-group/descriptions'
import { resolveArray } from './core'

function resolveDetailValue(field: Record<string, unknown>, dataSource: Record<string, unknown>) {
  const dataIndex = String(field.dataIndex || '')
  const value = dataIndex ? dataSource[dataIndex] : undefined
  if (value === null || value === undefined || value === '') return '--'
  return String(value)
}

function resolveDetailLabel(field: Record<string, unknown>, index: number) {
  return String(field.label || field.dataIndex || `字段${index + 1}`)
}

function buildDescriptionsFields(fields: Record<string, unknown>[]) {
  return fields.map((field, index) => D(resolveDetailLabel(field, index), String(field.dataIndex || index)).val)
}

function buildDescriptionsDataSource(fields: Record<string, unknown>[], dataSource: Record<string, unknown>) {
  return fields.reduce<Record<string, unknown>>((result, field) => {
    const dataIndex = String(field.dataIndex || '')
    if (!dataIndex) return result
    result[dataIndex] = resolveDetailValue(field, dataSource)
    return result
  }, { ...dataSource })
}

const detailDescriptionsProps = {
  placement: 'vertical' as const,
  column: 3,
  labelPlacement: 'left' as const,
  labelWidth: null,
}

export function renderDetailFields(value: unknown, dataSource: Record<string, unknown> = {}) {
  const fields = resolveArray<Record<string, unknown>>(value)
  if (fields.length === 0) return null

  const descriptionsFields = buildDescriptionsFields(fields)
  const descriptionsDataSource = buildDescriptionsDataSource(fields, dataSource)

  return (
    <div className="hiui-legacy-detail-descriptions" data-hiui-legacy-region="detail-body">
      <SchemaDescriptionsBridge fields={descriptionsFields} dataSource={descriptionsDataSource} descriptionsProps={detailDescriptionsProps} />
    </div>
  )
}

export function renderSupportingSections(value: unknown, dataSource: Record<string, unknown> = {}) {
  const sections = resolveArray<Record<string, unknown>>(value)
  if (sections.length === 0) return null

  return (
    <div className="hiui-legacy-supporting-sections" data-hiui-legacy-region="supporting-sections">
      {sections.map((section, index) => (
        <section className="hiui-legacy-supporting-section" key={String(section.title || index)}>
          <h2>{String(section.title || `分组${index + 1}`)}</h2>
          {renderDetailFields(section.fields, dataSource)}
        </section>
      ))}
    </div>
  )
}
