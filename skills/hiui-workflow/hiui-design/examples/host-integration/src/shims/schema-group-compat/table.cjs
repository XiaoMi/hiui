const {
  React,
  resolveFieldDataIndex,
  resolveFieldKey,
  resolveFieldLabel,
  useGroupFieldData,
} = require('./shared.cjs')

function PlainTable(props) {
  const columns = Array.isArray(props.columns) ? props.columns : []
  const data = Array.isArray(props.data) ? props.data : []

  return React.createElement(
    'table',
    {
      className: props.className,
      'data-schema-group-compat': 'table',
    },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        columns.map((column) =>
          React.createElement('th', { key: column.key || column.dataKey || column.dataIndex }, column.title)
        )
      )
    ),
    React.createElement(
      'tbody',
      null,
      data.map((row, rowIndex) =>
        React.createElement(
          'tr',
          { key: row.id || row.key || rowIndex },
          columns.map((column) =>
            React.createElement(
              'td',
              { key: `${column.key || column.dataKey || column.dataIndex}-${rowIndex}` },
              row?.[column.dataKey || column.dataIndex]
            )
          )
        )
      )
    )
  )
}

function resolveTableComponent() {
  if (typeof document === 'undefined') return PlainTable

  try {
    const tableModule = require('hiui5-table')
    return tableModule.Table || tableModule.default || tableModule
  } catch {
    return PlainTable
  }
}

function SchemaTableBridge(props) {
  const {
    dataIndex,
    dataSource,
    fields = [],
    tableProps,
    ...rest
  } = props
  const resolvedDataSource = useGroupFieldData(dataIndex, { dataSource })
  const data = Array.isArray(resolvedDataSource) ? resolvedDataSource : []
  const columns = fields.map((field, index) => ({
    title: resolveFieldLabel(field),
    key: resolveFieldKey(field, index),
    dataKey: resolveFieldDataIndex(field),
    dataIndex: resolveFieldDataIndex(field),
    width: field?.wrapperProps?.width,
  }))
  const Table = resolveTableComponent()

  return React.createElement(Table, {
    columns,
    data,
    ...(tableProps || {}),
    ...rest,
  })
}

module.exports = {
  SchemaTableBridge,
}
