const React = require('react')

const GroupMapContext = React.createContext(null)
const GroupDataContext = React.createContext(null)

function joinClassNames(...classNames) {
  return classNames.filter(Boolean).join(' ')
}

function getPathValue(source, pathValue) {
  if (!source || !pathValue) return undefined
  return String(pathValue)
    .split('.')
    .filter(Boolean)
    .reduce((current, key) => (current == null ? undefined : current[key]), source)
}

function renderValue(value) {
  return value === null || value === undefined || value === '' ? '--' : value
}

function resolveFieldLabel(field = {}) {
  return field.title || field._titleText || ''
}

function resolveFieldKey(field = {}, index = 0) {
  return field.key || field.dataIndex || `${resolveFieldLabel(field)}-${index}`
}

function resolveFieldDataIndex(field = {}) {
  return field.dataIndex || field.key || ''
}

function resolveGroupTitle(group = {}) {
  return group.title || group._titleText || group.config?.title || ''
}

function resolveGroupBordered(group = {}, fallback = true) {
  return group?.control?.bordered ?? fallback
}

function GroupMapProvider(props) {
  return React.createElement(
    GroupMapContext.Provider,
    { value: props.groups || null },
    props.children
  )
}

function GroupDataProvider(props) {
  return React.createElement(
    GroupDataContext.Provider,
    { value: { dataSource: props.dataSource || {} } },
    props.children
  )
}

function useGroupMap(opts = {}) {
  const contextGroupMap = React.useContext(GroupMapContext)
  if (opts.groupMap) return opts.groupMap
  if (contextGroupMap) return contextGroupMap
  return {
    text() {
      return React.createElement('div', null, 'text')
    },
  }
}

function matchGroupRenderer(opts = {}) {
  const groupMap = opts.groupMap || {}
  const group = opts.group || {}
  const matchedRenderer = groupMap[group.type]

  if (matchedRenderer) return matchedRenderer

  return function NoopFallback() {
    return React.createElement('div', null, 'NoopFallback')
  }
}

function useMatchGroupRenderer(opts = {}) {
  const groupMap = useGroupMap(opts)
  return matchGroupRenderer({
    ...opts,
    groupMap,
  })
}

function useGroupData() {
  return React.useContext(GroupDataContext) || {}
}

function useGroupFieldData(dataIndex, opts = {}) {
  const ctx = React.useContext(GroupDataContext)
  if (opts.dataSource) return opts.dataSource
  if (!ctx || !dataIndex) return undefined
  return getPathValue(ctx.dataSource, dataIndex)
}

function PlainCard(props) {
  const {
    bordered: _bordered,
    className,
    children,
    title,
    ...rest
  } = props

  return React.createElement(
    'section',
    {
      ...rest,
      className: joinClassNames('hi-v5-card', className),
      'data-schema-group-compat': 'card',
    },
    title
      ? React.createElement(
          'div',
          {
            className: 'hi-v5-card__header',
            'data-schema-group-compat': 'card-header',
          },
          React.createElement(
            'div',
            {
              className: 'hi-v5-card__title',
              'data-schema-group-compat': 'card-title',
            },
            title
          )
        )
      : null,
    React.createElement(
      'div',
      {
        className: 'hi-v5-card__body',
        'data-schema-group-compat': 'card-body',
      },
      children
    )
  )
}

function resolveCardComponent() {
  if (typeof document === 'undefined') return PlainCard

  try {
    const hiui5 = require('hiui5')
    return hiui5.Card || hiui5.default?.Card || PlainCard
  } catch {
    return PlainCard
  }
}

function GroupSectionCard(props) {
  const CardComponent = resolveCardComponent()
  const group = props.group || {}
  const showTitle = !group?.control?.hideTitle
  const title = showTitle ? resolveGroupTitle(group) : undefined
  const extraCardProps = props.group?.control?.extraCardProps || {}
  const bordered = resolveGroupBordered(group, props.bordered)

  return React.createElement(
    'section',
    {
      className: 'group-panel',
      'data-group-type': group.type,
      'data-group-name': group._titleText,
      'data-group-key': group.dataIndex,
      'data-bordered': bordered,
      'data-readonly': group?.control?.readonly,
      'data-nest-level': props.nestLevel ?? 1,
    },
    React.createElement(
      CardComponent,
      {
        bordered: false,
        ...extraCardProps,
        className: extraCardProps.className,
        title,
      },
      props.children
    )
  )
}

module.exports = {
  React,
  GroupMapProvider,
  GroupDataProvider,
  useGroupMap,
  matchGroupRenderer,
  useMatchGroupRenderer,
  useGroupData,
  useGroupFieldData,
  GroupSectionCard,
  renderValue,
  resolveFieldDataIndex,
  resolveFieldKey,
  resolveFieldLabel,
  resolveGroupBordered,
  joinClassNames,
}
