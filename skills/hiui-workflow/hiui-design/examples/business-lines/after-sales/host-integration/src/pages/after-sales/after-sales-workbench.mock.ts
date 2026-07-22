export type WorkbenchStatusTone =
  | 'primary'
  | 'warning'
  | 'success'
  | 'danger'
  | 'default'
  | 'skyblue'
  | 'rosered'

export type WorkbenchListFilterKey = 'pending' | 'processing' | 'confirmed'
export type WorkbenchAssistFilterKey = 'to-pay' | 'complete-machine' | 'editing'
export type WorkbenchProcessType =
  | 'repair'
  | 'replace'
  | 'inspect'
  | 'insurance'
  | 'multi-dimensional'

export type WorkbenchPlanKey = 'battery' | 'subsidy' | 'loaner'
export type TimelineEntryKey = 'logistics' | 'scan' | 'receive'

export type WorkbenchListFilter = {
  count: number
  key: WorkbenchListFilterKey
  label: string
}

export type WorkbenchAssistFilter = {
  count: number
  key: WorkbenchAssistFilterKey
  label: string
}

export type WorkbenchMediaItem = {
  color: string
  id: string
  label: string
}

export type WorkbenchFaultTag = {
  id: string
  label: string
}

export type WorkbenchChecklistItem = {
  checked: boolean
  id: string
  label: string
}

export type WorkbenchAction = {
  id: string
  label: string
}

export type WorkbenchDetailSection = {
  fields: Array<{ label: string; value: string }>
  id: string
  title: string
}

export type WorkbenchServicePlan = {
  description: string
  key: WorkbenchPlanKey
  label: string
}

export type WorkbenchTimelineEntry = {
  id: TimelineEntryKey
  operator: string
  summary: string
  time: string
  title: string
}

export type WorkOrderRecord = {
  applianceSummary: string
  assistFilterKey: WorkbenchAssistFilterKey
  closeReason: string
  customer: {
    address: string
    mobile: string
    name: string
  }
  detailSections: WorkbenchDetailSection[]
  diagnosis: {
    disposition: string
    engineerSummary: string
    faultTags: WorkbenchFaultTag[]
    imageHint: string
    media: WorkbenchMediaItem[]
    packageItems: WorkbenchChecklistItem[]
    responsibilityText: string
  }
  fsn: string
  id: string
  imei: string
  links: WorkbenchAction[]
  listBadges: string[]
  listFilterKey: WorkbenchListFilterKey
  listTimestamp: string
  logisticsNo: string
  note: string
  processType: WorkbenchProcessType
  product: {
    model: string
    priceLabel: string
    sku: string
    title: string
  }
  receipt: {
    address: string
    contact: string
    mobile: string
  }
  relatedTicketNo: string
  replacementPartSummary: string
  servicePlan: WorkbenchPlanKey
  shortcuts: WorkbenchAction[]
  sn: string
  stageBadges: string[]
  statusLabel: string
  statusTone: WorkbenchStatusTone
  timeline: WorkbenchTimelineEntry[]
  title: string
  topSummary: {
    aging: string
    applyEntry: string
    currentStage: string
    description: string
    submittedAt: string
  }
  workOrderNo: string
}

export const workbenchListFilters: WorkbenchListFilter[] = [
  { key: 'pending', label: '待接单', count: 5 },
  { key: 'processing', label: '检测处理', count: 24 },
  { key: 'confirmed', label: '用户确认', count: 8 },
]

export const workbenchAssistFilters: WorkbenchAssistFilter[] = [
  { key: 'to-pay', label: '用户支付', count: 6 },
  { key: 'complete-machine', label: '整机命中', count: 13 },
  { key: 'editing', label: '编辑中', count: 4 },
]

export const processTypeOptions: Array<{ key: WorkbenchProcessType; label: string }> = [
  { key: 'repair', label: '维修' },
  { key: 'replace', label: '换货' },
  { key: 'inspect', label: '检测' },
  { key: 'insurance', label: '保险换机' },
  { key: 'multi-dimensional', label: '多维换机' },
]

export const servicePlanOptions: WorkbenchServicePlan[] = [
  {
    key: 'battery',
    label: '更换电池',
    description: '原厂',
  },
  {
    key: 'subsidy',
    label: '更换电池文字超过一定长度',
    description: '特批',
  },
  {
    key: 'loaner',
    label: '以换代修（换机）',
    description: '原厂',
  },
]

export const workOrders: WorkOrderRecord[] = [
  {
    id: 'work-001',
    workOrderNo: '#4356号',
    title: 'Xiaomi 15S Pro 12+256 墨羽',
    statusLabel: '维修中',
    statusTone: 'warning',
    listTimestamp: '07/28 12:24 小米南城 创建',
    listBadges: ['维修', '待接单', '异形机'],
    listFilterKey: 'processing',
    assistFilterKey: 'editing',
    stageBadges: ['维修', '#4356 号', '特级加处理', '催单'],
    relatedTicketNo: '#45657568678699',
    product: {
      title: 'Xiaomi 15S Pro 12+256 墨羽',
      sku: 'MEB: 35434/276X00959',
      priceLabel: '1999',
      model: '三板机件：2345445',
    },
    imei: '34534645756767',
    sn: '34534645756767',
    topSummary: {
      aging: '5天+',
      description: '1627262927普通维修，维修用户，天猫笔记用户',
      submittedAt: '2023/02/20 21:25:48',
      currentStage: '检测处理',
      applyEntry: '小米商城',
    },
    customer: {
      name: '张**',
      mobile: '1890****2345',
      address: '中国大陆湖北省洪山区珞瑜东街高新区九峰一路',
    },
    receipt: {
      contact: '张先生',
      mobile: '189****2345',
      address: '中国大陆湖北省武汉市东湖高新区九峰一路',
    },
    applianceSummary: 'Xiaomi 15S Pro 12+256 墨羽',
    diagnosis: {
      responsibilityText: '复判步骤：现场检测 是否复现：是 处理方案：更换相关配件',
      engineerSummary: '手机无法开机',
      faultTags: [
        { id: 'fault-1', label: '主屏外玻璃破损/碎裂' },
        { id: 'fault-2', label: '电池盖破损/碎裂' },
      ],
      media: [
        { id: 'media-1', label: '故障图 1', color: '#5e83ff' },
        { id: 'media-2', label: '故障图 2', color: '#ff9b42' },
      ],
      imageHint:
        '拍摄要求: 【检测照片】[拆机后]透出拆机后的内部关键信息/损坏表现展示拆开后盖或主板，保持正面显示',
      packageItems: [
        { id: 'pkg-1', label: 'Xiaomi 14-全网通版-GB+256GB-白色', checked: false },
        { id: 'pkg-2', label: '充电器', checked: false },
        { id: 'pkg-3', label: '原件电池', checked: false },
        { id: 'pkg-4', label: '其他', checked: false },
        { id: 'pkg-5', label: '数据线', checked: false },
        { id: 'pkg-6', label: '数据线', checked: false },
      ],
    },
    servicePlan: 'battery',
    processType: 'repair',
    replacementPartSummary: '560007000N800 二主屏组件 / 59000L 二主屏件',
    fsn: '',
    closeReason: '',
    logisticsNo: '',
    note: '',
    shortcuts: [
      { id: 'shortcut-1', label: '服务记录' },
      { id: 'shortcut-2', label: '部件三包' },
      { id: 'shortcut-3', label: '三包政策' },
      { id: 'shortcut-4', label: '产品百科' },
      { id: 'shortcut-5', label: '拆机视频' },
      { id: 'shortcut-6', label: '爆炸图' },
      { id: 'shortcut-7', label: '主板电路' },
    ],
    links: [
      { id: 'header-1', label: '未检单验证' },
      { id: 'header-2', label: '留言' },
      { id: 'header-3', label: '打印' },
      { id: 'header-4', label: '音视频' },
      { id: 'header-5', label: '聊天记录' },
      { id: 'header-6', label: '物流' },
      { id: 'header-7', label: '检测结果' },
    ],
    detailSections: [
      {
        id: 'detail-1',
        title: '服务方案',
        fields: [
          { label: '故障分类', value: '主屏亮点/暗点/坏点/拆屏' },
          { label: '故障描述', value: '复判步骤: 现场检测 是否复现: 是 处理方案: 更换相关配件' },
          { label: '人为拆机', value: '否' },
          { label: '处理方法', value: '断电小修' },
          { label: '维修用料', value: '560007000N800 二主屏组件 / 560007000N800 二主屏件' },
          { label: '服务价格', value: '¥390.00 质保期' },
          { label: '特批单', value: 'SA12243564752268 一审中 打印' },
          { label: '技术鉴定', value: 'SA12243564752268 待处理 打印' },
          { label: '备件机', value: '小米13 橙 12+256GB 待发货' },
        ],
      },
      {
        id: 'detail-2',
        title: '受理信息',
        fields: [
          { label: '受理机构', value: '湖北小米售服中心-小XCN00019...' },
          { label: '天猫订单用户', value: '否' },
          { label: '建单时间', value: '2023/02/20 21:25:48' },
          { label: '申请入口', value: '小米官网' },
          { label: '建单方式', value: '依据商品SKU信息' },
          { label: '建单机构', value: '粤西东莞售后服务公司-M-WD0010' },
          { label: '受理机构', value: '粤西东莞售后服务公司-M-WD0010' },
          { label: '快递支付方式', value: '小米支付' },
          { label: '期望上门时间', value: '2025-07-16 9:00-12:00' },
          { label: '实际上门时间', value: '2025-07-16 9:00-12:00' },
          { label: '备注', value: '不带黑色耳机' },
        ],
      },
    ],
    timeline: [
      {
        id: 'logistics',
        title: '物流签收',
        summary: '管理员',
        operator: '管理员',
        time: '2023/02/12 19:30:07',
      },
      {
        id: 'scan',
        title: '称重扫码',
        summary: '管理员',
        operator: '管理员',
        time: '2023/02/12 19:30:07',
      },
      {
        id: 'receive',
        title: '申请收货',
        summary: '管理员',
        operator: '管理员',
        time: '2023/02/12 19:30:07',
      },
    ],
  },
  {
    id: 'work-002',
    workOrderNo: '#4356',
    title: 'Xiaomi 15S Pro 12+256 墨羽',
    statusLabel: '待维修',
    statusTone: 'primary',
    listTimestamp: '07/28 12:24 小米南城 创建',
    listBadges: ['维修', '#4356', '用户确认'],
    listFilterKey: 'pending',
    assistFilterKey: 'to-pay',
    stageBadges: ['维修', '#4356 号'],
    relatedTicketNo: '#45657568678699',
    product: {
      title: 'Xiaomi 15S Pro 12+256 墨羽',
      sku: 'MEB: 35434/276X00959',
      priceLabel: '1999',
      model: '三板机件：2345445',
    },
    imei: '34534645756767',
    sn: '34534645756767',
    topSummary: {
      aging: '2天',
      description: '1627262927普通维修，维修用户',
      submittedAt: '2023/02/21 09:15:18',
      currentStage: '待接单',
      applyEntry: '小米商城',
    },
    customer: {
      name: '王**',
      mobile: '1780****0011',
      address: '中国大陆北京市朝阳区酒仙桥路10号',
    },
    receipt: {
      contact: '王女士',
      mobile: '178****0011',
      address: '北京市朝阳区酒仙桥路10号B座',
    },
    applianceSummary: 'Xiaomi 15S Pro 12+256 墨羽',
    diagnosis: {
      responsibilityText: '复判步骤：待接单确认 是否复现：待检测 处理方案：待指派',
      engineerSummary: '手机后盖翘起，偶发黑屏',
      faultTags: [{ id: 'fault-3', label: '后盖松动/变形' }],
      media: [{ id: 'media-3', label: '故障图 1', color: '#b6c1dc' }],
      imageHint: '待工程师接单后上传检测照片与视频',
      packageItems: [{ id: 'pkg-7', label: '数据线', checked: true }],
    },
    servicePlan: 'subsidy',
    processType: 'inspect',
    replacementPartSummary: '待接单后补充',
    fsn: '',
    closeReason: '',
    logisticsNo: '',
    note: '',
    shortcuts: [{ id: 'shortcut-8', label: '服务记录' }],
    links: [{ id: 'header-8', label: '留言' }],
    detailSections: [
      {
        id: 'detail-3',
        title: '服务方案',
        fields: [{ label: '当前状态', value: '待接单' }],
      },
    ],
    timeline: [
      {
        id: 'receive',
        title: '申请收货',
        summary: '系统',
        operator: '系统',
        time: '2023/02/11 08:10:20',
      },
    ],
  },
  {
    id: 'work-003',
    workOrderNo: '#4356',
    title: 'Xiaomi 15S Pro 12+256 墨羽',
    statusLabel: '已完结',
    statusTone: 'success',
    listTimestamp: '07/28 12:24 小米南城 创建',
    listBadges: ['维修', '#4356', '完结'],
    listFilterKey: 'confirmed',
    assistFilterKey: 'complete-machine',
    stageBadges: ['维修'],
    relatedTicketNo: '#45657568678699',
    product: {
      title: 'Xiaomi 15S Pro 12+256 墨羽',
      sku: 'MEB: 35434/276X00959',
      priceLabel: '1999',
      model: '三板机件：2345445',
    },
    imei: '34534645756767',
    sn: '34534645756767',
    topSummary: {
      aging: '0天',
      description: '已完结工单',
      submittedAt: '2023/02/10 11:15:18',
      currentStage: '用户确认',
      applyEntry: '小米官网',
    },
    customer: {
      name: '李**',
      mobile: '1360****8877',
      address: '中国大陆上海市徐汇区漕溪北路399号',
    },
    receipt: {
      contact: '李先生',
      mobile: '136****8877',
      address: '上海市徐汇区漕溪北路399号',
    },
    applianceSummary: 'Xiaomi 15S Pro 12+256 墨羽',
    diagnosis: {
      responsibilityText: '工单已完结',
      engineerSummary: '更换电池后开机正常',
      faultTags: [{ id: 'fault-4', label: '电池鼓包' }],
      media: [{ id: 'media-4', label: '完结图', color: '#5fbe80' }],
      imageHint: '完结工单无补充',
      packageItems: [{ id: 'pkg-8', label: '充电器', checked: true }],
    },
    servicePlan: 'battery',
    processType: 'repair',
    replacementPartSummary: '电池组件已更换',
    fsn: 'FSN-202604290001',
    closeReason: '检测维修完成',
    logisticsNo: 'SF123456789',
    note: '用户已确认取机',
    shortcuts: [{ id: 'shortcut-9', label: '主板电路' }],
    links: [{ id: 'header-9', label: '打印' }],
    detailSections: [
      {
        id: 'detail-4',
        title: '服务方案',
        fields: [{ label: '处理结果', value: '已完结' }],
      },
    ],
    timeline: [
      {
        id: 'logistics',
        title: '物流签收',
        summary: '系统',
        operator: '系统',
        time: '2023/02/08 12:22:10',
      },
    ],
  },
]
