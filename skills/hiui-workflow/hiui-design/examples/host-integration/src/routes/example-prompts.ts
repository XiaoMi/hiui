function formatPageActions(pageActions: string[], primaryAction?: string) {
  return pageActions
    .map((action) => `"${action}"${action === primaryAction ? '（主操作）' : ''}`)
    .join('、')
}

function createHeaderRegionLine({
  pageName,
  pageActions,
  primaryAction,
}: {
  pageName: string
  pageActions: string[]
  primaryAction?: string
}) {
  const actionText = pageActions.length > 0 ? `；页面操作包含${formatPageActions(pageActions, primaryAction)}` : ''

  return `- 页头区域：页面名称为"${pageName}"${actionText}。`
}

function createListPagePrompt({
  pageType,
  pageName,
  pageActions,
  primaryAction,
  searchPlaceholder,
  filters,
  tableFields,
  rowActions,
  extraLines = [],
}: {
  pageType: string
  pageName: string
  pageActions: string[]
  primaryAction?: string
  searchPlaceholder?: string
  filters?: string[]
  tableFields?: string[]
  rowActions?: string[]
  extraLines?: string[]
}) {
  const lines = [`基于hiui-design 生成一个${pageType}。`]
  lines.push('- 页面结构：页面由"页头区域"、"检索筛选区"、"表格区"组成；检索筛选区负责承载关键词检索和条件筛选，表格区负责承载列表数据与行操作。')
  lines.push(createHeaderRegionLine({ pageName, pageActions, primaryAction }))

  if (searchPlaceholder) {
    lines.push(`- 检索筛选区：包含一个关键词搜索位；该搜索位沿用页面壳的 searchPlaceholder 链路，placeholder 文案为"${searchPlaceholder}"。`)
  }

  if (filters?.length) {
    lines.push(`- 筛选区字段包含${filters.map((item) => `"${item}"`).join('、')}。`)
  }

  lines.push(
    '- QueryFilter 字段基线：`@/typical-page-reuse/query-filter/managed-query-filter-fields` 是唯一默认入口；普通文本筛选字段使用 createManagedQueryTextField（filter-text-input），Select / 日期字段分别使用 createManagedQuerySelectField、createManagedQueryDateRangeField，所有字段共享同一 filled 筛选表面；不得复用第二个 SearchInput，也不得回退成裸 Input。'
  )

  lines.push(...extraLines)

  if (tableFields?.length) {
    lines.push(`- 表格区字段包含${tableFields.map((item) => `"${item}"`).join('、')}。`)
  }

  if (rowActions?.length) {
    lines.push(`- 表格行操作区：包含${rowActions.map((item) => `"${item}"`).join('、')}。`)
  }

  return lines.join('\n')
}

function createFormPagePrompt({
  pageType,
  pageName,
  pageActions,
  primaryAction,
  drawerTitle,
  layout,
  groups,
  fields,
  footerActions,
}: {
  pageType: string
  pageName: string
  pageActions: string[]
  primaryAction?: string
  drawerTitle?: string
  layout: string
  groups?: Array<{ title: string; fields: string[] }>
  fields?: string[]
  footerActions: string[]
}) {
  const lines = [`基于hiui-design 生成一个${pageType}。`]

  lines.push(
    drawerTitle
      ? '- 页面结构：页面由"页头区域"、"内容占位区"、"抽屉表单区"组成；页头区域和内容占位区负责打开抽屉，抽屉表单区承载字段填写与底部操作。'
      : '- 页面结构：页面由"页头区域"、"表单内容区"、"底部操作区"组成；表单内容区按业务分组承载字段，底部操作区承载编辑流程操作。'
  )
  lines.push(createHeaderRegionLine({ pageName, pageActions, primaryAction }))

  if (drawerTitle) {
    lines.push(`- 抽屉表单区：抽屉标题为"${drawerTitle}"，表单布局为"${layout}"。`)
  } else {
    lines.push(`- 表单内容区：表单布局为"${layout}"。`)
  }

  if (groups?.length) {
    lines.push(
      `- 表单内容区分组包含${groups
        .map((group) => `"${group.title}"（${group.fields.map((field) => `"${field}"`).join('、')}）`)
        .join('、')}`
    )
  }

  if (fields?.length) {
    lines.push(`- 抽屉表单区字段包含${fields.map((field) => `"${field}"`).join('、')}。`)
  }

  if (footerActions.length > 0) {
    lines.push(`- 底部操作区：包含${footerActions.map((action) => `"${action}"`).join('、')}。`)
  }

  return lines.join('\n')
}

function createDetailPagePrompt({
  pageType,
  pageName,
  pageActions,
  primaryAction,
  drawerTitle,
  groups,
  fields,
}: {
  pageType: string
  pageName: string
  pageActions: string[]
  primaryAction?: string
  drawerTitle?: string
  groups?: Array<{ title: string; fields: string[] }>
  fields?: string[]
}) {
  const lines = [`基于hiui-design 生成一个${pageType}。`]

  lines.push(
    drawerTitle
      ? '- 页面结构：页面由"页头区域"、"内容占位区"、"抽屉详情区"组成；页头区域和内容占位区负责打开抽屉，抽屉详情区承载只读详情信息。'
      : '- 页面结构：页面由"页头区域"和"详情内容区"组成；详情内容区按业务分组承载只读字段。'
  )
  lines.push(createHeaderRegionLine({ pageName, pageActions, primaryAction }))

  if (drawerTitle) {
    lines.push(`- 抽屉详情区：抽屉标题为"${drawerTitle}"。`)
  }

  if (groups?.length) {
    lines.push(
      `- 详情内容区分组包含${groups
        .map((group) => `"${group.title}"（${group.fields.map((field) => `"${field}"`).join('、')}）`)
        .join('、')}`
    )
  }

  if (fields?.length) {
    lines.push(`- 抽屉详情区字段包含${fields.map((field) => `"${field}"`).join('、')}。`)
  }

  return lines.join('\n')
}

function createFeedbackPagePrompt({
  pageName,
  description,
  primaryAction,
}: {
  pageName: string
  description: string
  primaryAction: string
}) {
  return [
    '基于hiui-design 生成一个异常反馈页。',
    '- 页面结构：页面由"页头区域"和"反馈内容区"组成；反馈内容区居中展示 EmptyState、说明文案与操作按钮。',
    createHeaderRegionLine({
      pageName,
      pageActions: ['主操作', '次要操作', '次要操作'],
      primaryAction: '主操作',
    }),
    `- 反馈内容区包含反馈标题"${pageName}"、反馈描述"${description}"。`,
    `- 反馈内容区操作：包含"${primaryAction}"（主操作）、"次要操作"。`,
  ].join('\n')
}

const workOrderGroups = [
  {
    title: '基础信息',
    fields: [
      '工单号',
      '工单状态',
      '工单类型',
      '服务方式',
      '关联商品',
      '购买渠道',
      '三包开始时间',
      '三包截止时间',
      '来访原因',
    ],
  },
  {
    title: '客户信息',
    fields: ['用户姓名', '用户标签', '用户电话'],
  },
  {
    title: '服务信息',
    fields: ['服务机构', '服务工程师', '受理时间', '问题描述'],
  },
]

const drawerUserFields = [
  '用户姓名',
  '米聊号',
  '用户电话',
  '邮箱',
  '用户角色',
  '岗位名称',
  '所属机构',
  '入职日期',
  '用户状态',
  '备注信息',
]

export const typicalExamplePrompts = {
  basicTable: createListPagePrompt({
    pageType: '基础列表页',
    pageName: '基础表格',
    pageActions: ['新增用户', '导出'],
    primaryAction: '新增用户',
    searchPlaceholder: '用户名称 / 米聊 / 电话',
    filters: ['角色', '所属机构', '用户状态'],
    tableFields: [
      '用户姓名',
      '米聊号',
      '用户电话',
      '邮箱',
      '用户角色',
      '岗位名称',
      '所属机构',
      '用户状态',
      '最近更新',
    ],
    rowActions: ['查看', '编辑'],
  }),
  tableStat: [
    '基于hiui-design 生成一个数据统计表页。',
    '- 页面结构：页面由"页头区域"、"统计概览区"、"检索筛选区"、"表格区"组成；统计概览区展示汇总指标，检索筛选区负责筛选明细数据，表格区展示可分页明细数据。',
    '- 页头区域：页面名称为"数据统计表"；页面操作包含"导出"、"刷新"。',
    '- 统计概览区指标包含"建单量"、"签收量"、"业务完成量"、"不予受理量"、"取消量"。',
    '- 检索筛选区：包含一个关键词 SearchInput；SearchInput 的 placeholder 文案为"工程师姓名"。',
    '- 筛选区字段包含"工程师"、"时间范围"。',
    '- 表格区字段包含"工程师姓名"、"时间范围"、"建单量"、"签收量"、"业务完成量"、"不予受理量"、"取消量"、"签收前取消量"、"签收后取消量"、"取消重建量"。',
  ].join('\n'),
  treeTable: [
    '基于hiui-design 生成一个树形表格页。',
    '- 页面结构：页面由"页头区域"、"检索筛选区"、"树形表格区"组成；树形表格区使用首列承载层级节点，支持父子节点展开/收起和行级操作。',
    '- 页头区域：页面名称为"树形表格"；页面操作包含"新增部门"（主操作）、"导出"。',
    '- 检索筛选区：包含一个关键词 SearchInput 和一组筛选项；SearchInput 的 placeholder 文案为"部门名称 / 职责关键词"。',
    '- 筛选区字段包含"负责人"、"所属机构"。',
    '- 树节点字段包含"节点名称"、"节点唯一标识"、"父级节点"、"子节点列表"。',
    '- 树形表格区字段包含"部门"、"部门状态"、"部门职责"、"负责人"、"成员数量"、"所属机构"、"部门描述"。',
    '- 树形表格行操作区：包含"编辑"、"子部门"。',
  ].join('\n'),
  inventorySplit: [
    '基于hiui-design 生成一个左树右表页。',
    '- 页面结构：页面由"页头区域"、"左侧树区域"、"右侧列表区域"组成；左侧树负责承载层级分类/组织维度，右侧列表根据左侧选中节点联动刷新。',
    '- 页头区域：页面名称为"左树右表"；页面操作包含"新增物料"（主操作）、"导入"。',
    '- 左侧树区域：包含一个树节点关键词 SearchInput 和一个可展开、可选中的 Tree；SearchInput 的 placeholder 文案为"搜索品类"。',
    '- 左侧树区域字段包含"节点名称"、"节点唯一标识"、"父级节点"、"子节点列表"。',
    '- 右侧列表区域：顶部包含一个列表关键词 SearchInput 和一组筛选项；SearchInput 的 placeholder 文案为"物料名称 / 物料编码"。',
    '- 右侧筛选区字段包含"物品属性"、"品相"。',
    '- 右侧表格区字段包含"序号"、"物料名称"、"物料编码"、"单位"、"串号管理"、"物品属性"、"品相"、"金额"。',
    '- 右侧表格行操作："查看"。',
  ].join('\n'),
  dataVisualization: [
    '基于hiui-design 生成一个数据可视化页。',
    '- 页面结构：页面由"页头区域"、"页面全局控制条"、"指标概览区"、"图表分析区"、"明细筛选区"、"明细表格区"组成；页面全局控制条位于主体白底最上方并联动整页视角，指标概览区展示关键指标，图表分析区展示趋势/分布/占比，明细筛选区只在存在真实记录筛选时出现并贴近明细表格区。',
    '- 页头区域：页面名称为"数据可视化"。',
    '- 指标概览区指标包含"本月巡检任务"、"异常闭环率"、"平均响应时长"、"高风险设备"。',
    '- 图表分析区模块包含"任务趋势"、"风险分布"、"来源占比"、"闭环率"。',
    '- 页面全局控制条：使用 segmented / radio / tabs 切换"日"、"周"、"月"或分析视角；不要使用真实 QueryFilter，也不要出现整块灰底背景。',
    '- 明细筛选区：若需要记录级筛选，则使用真实 QueryFilter；关键词 SearchInput 的 placeholder 文案为"区域 / 风险点 / 趋势洞察"。',
    '- 明细筛选字段包含"区域"、"任务来源"、"时间范围"；不要与页面全局控制条混排在同一行。',
    '- 明细表格区字段包含"区域"、"任务来源"、"趋势洞察"、"趋势变化"、"闭环率"、"异常数"、"重点风险点"、"最近更新"。',
  ].join('\n'),
  fullPageEdit: createFormPagePrompt({
    pageType: '全页编辑页',
    pageName: '全页编辑',
    pageActions: [],
    layout: '三列表单，字段区水平间距 40px，底部操作固定在页面底部',
    groups: workOrderGroups,
    footerActions: ['取消', '暂存', '提交'],
  }),
  drawerForm: createFormPagePrompt({
    pageType: '抽屉表单页',
    pageName: '抽屉表单',
    pageActions: ['打开抽屉'],
    primaryAction: '打开抽屉',
    drawerTitle: '新增用户',
    layout: '抽屉宽度 600px，双列表单',
    fields: drawerUserFields,
    footerActions: ['取消', '确认'],
  }),
  fullPageDetail: createDetailPagePrompt({
    pageType: '全页详情页',
    pageName: '全页详情',
    pageActions: ['查看流程'],
    groups: workOrderGroups,
  }),
  drawerDetail: createDetailPagePrompt({
    pageType: '抽屉详情页',
    pageName: '抽屉详情',
    pageActions: ['打开抽屉'],
    primaryAction: '打开抽屉',
    drawerTitle: '用户详情',
    fields: drawerUserFields,
  }),
  emptyState: createFeedbackPagePrompt({
    pageName: '暂无数据',
    description: '请先进行数据的添加和新建，或者查看说明文档',
    primaryAction: '立即创建',
  }),
  loadFail: createFeedbackPagePrompt({
    pageName: '加载失败',
    description: '请先进行数据的添加和新建，或者联系管理员',
    primaryAction: '立即重试',
  }),
  pageNotFound: createFeedbackPagePrompt({
    pageName: '页面不存在',
    description: '请先进行数据的添加和新建，或者联系管理员',
    primaryAction: '返回首页',
  }),
  noPermission: createFeedbackPagePrompt({
    pageName: '暂无权限',
    description: '抱歉，您没有当前模块的访问权限，请联系管理员',
    primaryAction: '立即申请',
  }),
  underConstruction: createFeedbackPagePrompt({
    pageName: '页面建设中',
    description: '抱歉，当前页面建设中，详情请联系管理员',
    primaryAction: '返回首页',
  }),
  networkError: createFeedbackPagePrompt({
    pageName: '网络异常',
    description: '抱歉，网络连接中断，请稍后再试！，或联系管理员',
    primaryAction: '刷新页面',
  }),
  intranetOffline: createFeedbackPagePrompt({
    pageName: '未连接内网',
    description: '抱歉，网络连接中断，请稍后再试！，或联系管理员',
    primaryAction: '刷新页面',
  }),
}
