function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

const POSITIVE_PROCESS_STAGE_OUTPUT = {
  inputSummary: {
    inputMode: 'page-prompt',
    evidence: ['阶段轨驱动主区内容', '多个稳定区域共同承担主任务'],
    knowns: ['页面需要单页完成流程确认'],
    unknowns: [],
  },
  classification: {
    familyDecision: 'yes',
    recommendedRoute: 'non-typical-page',
    confidence: 'high',
    reasons: ['多个稳定区域共同承担主任务', '不存在单一典型页骨架可稳定承载'],
    boundaryRisk: ['不要误降级成详情页加侧栏'],
    nextAction: 'continue-decision-package',
  },
  nonTypicalDecisionPackage: {
    pageFamily: 'non-typical-page',
    pageGoal: '围绕单个订单完成阶段式核查与确认。',
    primaryWorkflows: ['查看订单上下文', '沿阶段轨定位当前步骤', '完成订单确认'],
    pageHeaderPlan: {
      title: '确认订单信息',
      hasBack: true,
      primaryActions: ['确认订单'],
      hostConflictPolicy: 'auto-hide-while-mounted',
      restorePolicy: 'restore-on-unmount',
    },
    whiteBodyPlan: {
      owner: 'single-primary-workspace-owner',
      workspaceMode: 'multi-panel-workspace',
      outerSurfaceMode: 'gray-slot-with-white-body',
      mountRegionFillPolicy: 'fill-available-content-region',
      hostEscalationRule: 'block-only-when-mount-region-not-stretchable',
    },
    regionPlan: {
      primaryRegion: 'center-confirmation-region',
      secondaryRegions: ['left-context-region', 'center-stage-rail-region', 'right-snapshot-region'],
      stableRegions: [
        'left-context-region',
        'center-stage-rail-region',
        'center-confirmation-region',
        'right-snapshot-region',
      ],
      mutableRegions: ['current-stage-detail-section'],
      readingFlow: '先看上下文，再看阶段轨，最后在主区完成确认。',
    },
    coordinationModel: {
      type: 'process-stage-sync',
      sourceRegion: 'center-stage-rail-region',
      targetRegions: ['center-confirmation-region', 'right-snapshot-region'],
      interactionRule: '阶段轨决定当前处理步骤，并稳定驱动主区与快照。',
    },
    dataCarriers: ['context panel', 'stage rail', 'detail sections', 'snapshot panel'],
    dataShape: {
      chartUsage: 'none',
      regionShapes: [
        {
          regionId: 'left-context-region',
          regionRole: 'contextRegion',
          entityShape: 'single-record',
          cardinality: 'single',
          density: 'compact',
          updateMode: 'static',
          visualizationHint: 'descriptions',
        },
        {
          regionId: 'center-stage-rail-region',
          regionRole: 'sourceRegion',
          entityShape: 'state-flow',
          cardinality: 'single',
          density: 'compact',
          updateMode: 'stage-driven',
          visualizationHint: 'timeline',
        },
        {
          regionId: 'center-confirmation-region',
          regionRole: 'primaryRegion',
          entityShape: 'section-list',
          cardinality: 'single',
          density: 'regular',
          updateMode: 'stage-driven',
          visualizationHint: 'form',
        },
        {
          regionId: 'right-snapshot-region',
          regionRole: 'supportingRegion',
          entityShape: 'single-record',
          cardinality: 'single',
          density: 'compact',
          updateMode: 'stage-driven',
          visualizationHint: 'snapshot',
        },
      ],
      crossRegionDependencies: [
        {
          sourceRegion: 'center-stage-rail-region',
          targetRegion: 'center-confirmation-region',
          relationship: 'stage-drives-content',
        },
      ],
    },
    interactionContracts: ['阶段轨必须稳定驱动当前处理上下文'],
    designSystemPlan: {
      preferredSources: ['HiUI5', 'local-managed-runtime'],
      approvedEscapes: [],
    },
    sampleContentPlan: {
      contextFacts: [{ label: '订单编号', value: 'SO-2026-0814-001' }],
      sourceItems: [{ label: '订单检查', summary: '确认订单基础信息与交付约束。', badge: '进行中' }],
      primarySections: [
        {
          title: '订单信息确认',
          summary: '确认订单主信息、收货方式与交付约束。',
          fields: [{ label: '订单类型', value: '新车采购' }],
          bulletPoints: ['核对订单主体信息'],
        },
      ],
      snapshotFacts: [{ label: '订单状态', value: '待确认' }],
    },
    stopReason: '',
  },
  stopDecision: {
    stopBeforeCode: false,
    stopReason: '',
  },
}

const POSITIVE_SELECTION_DETAIL_OUTPUT = {
  inputSummary: {
    inputMode: 'page-prompt',
    evidence: ['左侧选择稳定驱动右侧分组详情', '多个区域共同承担主任务'],
    knowns: ['页面围绕售卖单履约确认'],
    unknowns: [],
  },
  classification: {
    familyDecision: 'yes',
    recommendedRoute: 'non-typical-page',
    confidence: 'high',
    reasons: ['选择区稳定驱动主工作区', '右侧不是单一典型表格工作面'],
    boundaryRisk: ['不要误判成典型 split 变体'],
    nextAction: 'continue-decision-package',
  },
  nonTypicalDecisionPackage: {
    pageFamily: 'non-typical-page',
    pageGoal: '选择机构售卖单并在分组明细中完成发货确认。',
    primaryWorkflows: ['选择售卖单', '核对摘要', '确认发货'],
    pageHeaderPlan: {
      title: '机构售卖单管理',
      hasBack: false,
      primaryActions: ['确认发货'],
      hostConflictPolicy: 'auto-hide-while-mounted',
      restorePolicy: 'restore-on-unmount',
    },
    whiteBodyPlan: {
      owner: 'single-primary-workspace-owner',
      workspaceMode: 'selection-detail-workspace',
      outerSurfaceMode: 'gray-slot-with-white-body',
      mountRegionFillPolicy: 'fill-available-content-region',
      hostEscalationRule: 'block-only-when-mount-region-not-stretchable',
    },
    regionPlan: {
      primaryRegion: 'right-grouped-detail-region',
      secondaryRegions: ['left-order-selection-region', 'right-order-summary-region'],
      stableRegions: [
        'left-order-selection-region',
        'right-order-summary-region',
        'right-grouped-detail-region',
      ],
      mutableRegions: ['group-expanded-table'],
      readingFlow: '先选左侧售卖单，再看右侧摘要与分组明细，最后执行确认发货。',
    },
    coordinationModel: {
      type: 'selection-detail-sync',
      sourceRegion: 'left-order-selection-region',
      targetRegions: ['right-order-summary-region', 'right-grouped-detail-region'],
      interactionRule: '左侧售卖单变化后，右侧摘要与分组明细同步切换。',
    },
    dataCarriers: ['selection list', 'summary header', 'grouped detail blocks'],
    dataShape: {
      chartUsage: 'none',
      regionShapes: [
        {
          regionId: 'left-order-selection-region',
          regionRole: 'sourceRegion',
          entityShape: 'collection',
          cardinality: 'multiple',
          density: 'compact',
          updateMode: 'selection-driven',
          visualizationHint: 'descriptions',
        },
        {
          regionId: 'right-order-summary-region',
          regionRole: 'supportingRegion',
          entityShape: 'single-record',
          cardinality: 'single',
          density: 'compact',
          updateMode: 'selection-driven',
          visualizationHint: 'snapshot',
        },
        {
          regionId: 'right-grouped-detail-region',
          regionRole: 'primaryRegion',
          entityShape: 'mixed',
          cardinality: 'multiple',
          density: 'regular',
          updateMode: 'selection-driven',
          visualizationHint: 'form',
        },
      ],
      crossRegionDependencies: [
        {
          sourceRegion: 'left-order-selection-region',
          targetRegion: 'right-order-summary-region',
          relationship: 'selection-drives-summary',
        },
        {
          sourceRegion: 'left-order-selection-region',
          targetRegion: 'right-grouped-detail-region',
          relationship: 'selection-drives-detail',
        },
      ],
    },
    interactionContracts: ['左侧选择必须稳定驱动右侧单据上下文'],
    designSystemPlan: {
      preferredSources: ['HiUI5', 'local-managed-runtime'],
      approvedEscapes: [],
    },
    sampleContentPlan: {
      selectionItems: [
        {
          key: 'order-1',
          label: '售卖单 A-1021',
          summary: '待确认发货',
          badge: '待处理',
          summaryFacts: [{ label: '机构', value: '华东示范校' }],
          detailGroups: [
            {
              title: '分组一',
              summary: '核对首批发货商品与数量。',
              fields: [{ label: '商品数', value: '12' }],
              bulletPoints: ['确认分组商品完整'],
            },
          ],
        },
      ],
    },
    stopReason: '',
  },
  stopDecision: {
    stopBeforeCode: false,
    stopReason: '',
  },
}

const BOUNDARY_PARTIAL_OUTPUT = {
  inputSummary: {
    inputMode: 'page-prompt',
    evidence: ['左侧卡片驱动右侧表格', '右侧仍是典型表格主承载体'],
    knowns: ['页面主任务仍主要依赖右侧表格完成'],
    unknowns: [],
  },
  classification: {
    familyDecision: 'partial',
    recommendedRoute: 'typical-page-variant',
    confidence: 'medium',
    reasons: ['具备 selection-detail-sync 特征', '但右侧仍是经典表格主承载体'],
    boundaryRisk: ['容易被误判成完全非典型页面'],
    nextAction: 'stop-at-boundary',
  },
  nonTypicalDecisionPackage: null,
  stopDecision: {
    stopBeforeCode: true,
    stopReason: '当前证据不足以证明页面已脱离典型列表页 split 变体。',
  },
}

const NEGATIVE_ANALYTICS_OUTPUT = {
  inputSummary: {
    inputMode: 'page-prompt',
    evidence: ['指标卡 + 趋势图 + 明细表', '分析页结构明显'],
    knowns: ['页面可被 analytics-page 覆盖'],
    unknowns: [],
  },
  classification: {
    familyDecision: 'no',
    recommendedRoute: 'analytics-page',
    confidence: 'high',
    reasons: ['标准分析页结构已成立'],
    boundaryRisk: ['不要误判成非典型页面'],
    nextAction: 'return-to-existing-family',
  },
  nonTypicalDecisionPackage: null,
  stopDecision: {
    stopBeforeCode: true,
    stopReason: '当前页面可被 analytics-page 覆盖，不应进入 non-typical-page。',
  },
}

const SCENARIOS = Object.freeze([
  Object.freeze({
    id: 'process-stage-positive',
    label: '确认订单信息',
    expectedOutcome: 'write',
    title: '确认订单信息',
    dest: 'src/pages/non-typical-validation/process-stage-page',
    output: POSITIVE_PROCESS_STAGE_OUTPUT,
  }),
  Object.freeze({
    id: 'selection-detail-positive',
    label: '机构售卖单管理',
    expectedOutcome: 'write',
    title: '机构售卖单管理',
    dest: 'src/pages/non-typical-validation/selection-detail-page',
    output: POSITIVE_SELECTION_DETAIL_OUTPUT,
  }),
  Object.freeze({
    id: 'boundary-partial',
    label: '方案一',
    expectedOutcome: 'blocked',
    title: '方案一',
    dest: 'src/pages/non-typical-validation/boundary-page',
    output: BOUNDARY_PARTIAL_OUTPUT,
    expectedErrorPatterns: [
      'classification.familyDecision must equal yes before execution brief creation',
    ],
  }),
  Object.freeze({
    id: 'negative-analytics',
    label: '业务规模',
    expectedOutcome: 'blocked',
    title: '业务规模',
    dest: 'src/pages/non-typical-validation/analytics-page',
    output: NEGATIVE_ANALYTICS_OUTPUT,
    expectedErrorPatterns: [
      'classification.recommendedRoute must equal non-typical-page',
      'classification.familyDecision must equal yes before execution brief creation',
    ],
  }),
])

export function listNonTypicalRealProjectValidationScenarios() {
  return SCENARIOS.map((item) => cloneJson(item))
}

export function getNonTypicalRealProjectValidationScenario(scenarioId) {
  const normalizedScenarioId = String(scenarioId || '').trim()
  const scenario = SCENARIOS.find((item) => item.id === normalizedScenarioId)

  if (!scenario) {
    throw new Error(
      `Unknown non-typical validation scenario "${normalizedScenarioId}". Known scenarios: ${SCENARIOS.map((item) => item.id).join(', ')}`
    )
  }

  return cloneJson(scenario)
}
