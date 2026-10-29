const HIUI5_ISOLATED_PEER_ALIASES = {
  '@hi-ui/hiui': 'hiui5',
  '@hi-ui/button': 'hiui5-button',
  '@hi-ui/cascader': 'hiui5-cascader',
  '@hi-ui/check-cascader': 'hiui5-check-cascader',
  '@hi-ui/check-select': 'hiui5-check-select',
  '@hi-ui/checkbox': 'hiui5-checkbox',
  '@hi-ui/counter': 'hiui5-counter',
  '@hi-ui/date-picker': 'hiui5-date-picker',
  '@hi-ui/descriptions': 'hiui5-descriptions',
  '@hi-ui/drawer': 'hiui5-drawer',
  '@hi-ui/ellipsis-tooltip': 'hiui5-ellipsis-tooltip',
  '@hi-ui/empty-state': 'hiui5-empty-state',
  '@hi-ui/form': 'hiui5-form',
  '@hi-ui/input': 'hiui5-input',
  '@hi-ui/loading': 'hiui5-loading',
  '@hi-ui/message': 'hiui5-message',
  '@hi-ui/number-input': 'hiui5-number-input',
  '@hi-ui/page-header': 'hiui5-page-header',
  '@hi-ui/preview': 'hiui5-preview',
  '@hi-ui/radio': 'hiui5-radio',
  '@hi-ui/select': 'hiui5-select',
  '@hi-ui/switch': 'hiui5-switch',
  '@hi-ui/table': 'hiui5-table',
  '@hi-ui/tabs': 'hiui5-tabs',
  '@hi-ui/tag': 'hiui5-tag',
  '@hi-ui/textarea': 'hiui5-textarea',
  '@hi-ui/tree-select': 'hiui5-tree-select',
  '@hi-ui/upload': 'hiui5-upload',
  ahooks: 'ahooks3',
}

const HIUI5_SPECIAL_BRIDGE_REQUESTS = [
  '@hi-ui/icons',
  '@hi-ui/schema-group',
  '@hi-ui/schema-group/descriptions',
  '@hi-ui/schema-group/table',
]

const HIUI5_REQUIRED_TRANSITIVE_PEERS = {
  '@hi-ui/button': '5.0.0-experimental.1',
  '@hi-ui/cascader': '>=5.0.0-experimental.3',
  '@hi-ui/check-cascader': '>=5.0.0-experimental.2',
  '@hi-ui/check-select': '>=5.0.0-experimental.5',
  '@hi-ui/checkbox': '>=5.0.0-experimental.1',
  '@hi-ui/counter': '>=5.0.0-experimental.2',
  '@hi-ui/date-picker': '5.0.0-experimental.3',
  '@hi-ui/descriptions': '5.0.0-canary.8',
  '@hi-ui/drawer': '5.0.0-experimental.1',
  '@hi-ui/form': '>=5.0.0-experimental.1',
  '@hi-ui/icons': '5.0.0-experimental.1',
  '@hi-ui/input': '5.0.0-experimental.2',
  '@hi-ui/message': '5.0.0-experimental.1',
  '@hi-ui/number-input': '>=5.0.0-experimental.2',
  '@hi-ui/page-header': '5.0.0-experimental.1',
  '@hi-ui/preview': '>=5.0.0-experimental.1',
  '@hi-ui/radio': '>=5.0.0-experimental.1',
  '@hi-ui/select': '5.0.0-experimental.2',
  '@hi-ui/switch': '>=5.0.0-experimental.1',
  '@hi-ui/table': '5.0.0-experimental.4',
  '@hi-ui/tabs': '>=5.0.0-experimental.1',
  '@hi-ui/tag': '5.0.0-experimental.2',
  '@hi-ui/textarea': '5.0.0-experimental.3',
  '@hi-ui/tree-select': '>=5.0.0-experimental.2',
  '@hi-ui/upload': '>=5.0.0-experimental.1',
}

const HIUI5_BRIDGE_PACKAGES = [
  '@hi-ui/schema-types',
  ...Object.keys(HIUI5_ISOLATED_PEER_ALIASES).filter((depName) => depName.startsWith('@hi-ui/')),
  ...HIUI5_SPECIAL_BRIDGE_REQUESTS,
]

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function createSchemaBridgePeerPattern() {
  const requests = [...new Set(HIUI5_BRIDGE_PACKAGES)]
  const inner = requests
    .map((request) => String(request).replace(/^@hi-ui\//, ''))
    .map((request) => escapeRegExp(request))
    .join('|')
  return new RegExp(`^@hi-ui\\/(?:${inner})$`)
}

module.exports = {
  HIUI5_BRIDGE_PACKAGES,
  HIUI5_ISOLATED_PEER_ALIASES,
  HIUI5_REQUIRED_TRANSITIVE_PEERS,
  HIUI5_SPECIAL_BRIDGE_REQUESTS,
  createSchemaBridgePeerPattern,
}
