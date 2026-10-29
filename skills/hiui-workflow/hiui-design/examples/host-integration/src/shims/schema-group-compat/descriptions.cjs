const {
  React,
  renderValue,
  resolveFieldDataIndex,
  resolveFieldKey,
  resolveFieldLabel,
  useGroupFieldData,
} = require('./shared.cjs')

const descriptionsModule = require('hiui5-descriptions')
const Descriptions =
  descriptionsModule.Descriptions || descriptionsModule.default || descriptionsModule
const DescriptionsItem = Descriptions.Item || descriptionsModule.DescriptionsItem

function SchemaDescriptionsBridge(props) {
  const {
    dataIndex,
    dataSource,
    descriptionsProps,
    fields = [],
    ...rest
  } = props
  const resolvedDataSource = useGroupFieldData(dataIndex, { dataSource }) || {}

  return React.createElement(
    Descriptions,
    {
      ...(descriptionsProps || {}),
      ...rest,
    },
    fields.map((field, index) =>
      React.createElement(
        DescriptionsItem,
        {
          key: resolveFieldKey(field, index),
          label: resolveFieldLabel(field),
          colSpan: field?.wrapperProps?.colSpan,
        },
        renderValue(resolvedDataSource[resolveFieldDataIndex(field)])
      )
    )
  )
}

module.exports = {
  SchemaDescriptionsBridge,
}
