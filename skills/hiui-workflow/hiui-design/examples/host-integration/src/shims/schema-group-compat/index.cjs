const {
  React,
  GroupDataProvider,
  GroupMapProvider,
  GroupSectionCard,
  joinClassNames,
  matchGroupRenderer,
  resolveGroupBordered,
  useGroupData,
  useGroupFieldData,
  useGroupMap,
  useMatchGroupRenderer,
} = require('./shared.cjs')

function SchemaGroup(props) {
  const groups = Array.isArray(props.groups) ? props.groups : []
  const groupMap = useGroupMap({ groupMap: props.groupMap })
  const borderedGroups = props.borderedGroups ?? true

  if (groups.length === 0) {
    return React.createElement('div', null, '未配置组')
  }

  if (!groupMap) {
    return React.createElement('div', null, '未配置组渲染器映射')
  }

  return React.createElement(
    'div',
    {
      className: props.className,
      'data-group-type': 'group',
    },
    React.createElement(
      'div',
      {
        className: joinClassNames('group-container', 'schema-group__container'),
        'data-bordered': borderedGroups,
        'data-el-type': groups.length > 1 ? 'multiple' : 'single',
      },
      groups.map((group, index) => renderGroup({ group, groupMap, index, borderedGroups }))
    )
  )
}

function renderGroup({ group, groupMap, index, borderedGroups }) {
  if (!group || group.type === 'simple') return null

  const key = group.dataIndex || group.key || index
  const bordered = resolveGroupBordered(group, borderedGroups)

  if (group.type === 'custom') {
    return React.createElement(
      GroupSectionCard,
      {
        bordered,
        group,
        key,
      },
      typeof group.config?.render === 'function' ? group.config.render() : null
    )
  }

  const MatchedGroupRenderer = matchGroupRenderer({
    group,
    groupMap,
  })
  const config = group.config || {}

  return React.createElement(
    GroupSectionCard,
    {
      bordered,
      group,
      key,
    },
    React.createElement(MatchedGroupRenderer, {
      dataIndex: group.dataIndex,
      fields: config.fields,
      ...(config.props || {}),
    })
  )
}

module.exports = {
  GroupDataProvider,
  GroupMapProvider,
  SchemaGroup,
  matchGroupRenderer,
  useGroupData,
  useGroupFieldData,
  useGroupMap,
  useMatchGroupRenderer,
}
