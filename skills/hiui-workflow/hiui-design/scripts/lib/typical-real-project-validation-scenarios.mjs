function cloneJson(value) {
  return JSON.parse(JSON.stringify(value))
}

const HOST_INTEGRATION_REGISTRY_CONTRACT = {
  routeRegistryPath: 'src/business-shell/routes.tsx',
  formalShellPath: 'src/business-shell/app-frame.tsx',
}

const GATE_STALE_BUT_RECOVERABLE_SCENARIO = {
  id: 'gate-stale-but-recoverable',
  label:
    'Freshness drift downgrades the page-task gate consistently across status, planner, and brief',
  validationKind: 'gate-stale-but-recoverable',
  pageTypeId: '',
  expectedOutcome: 'blocked',
  expectedBlockedBy: 'page-task-gate-not-ready',
  expectedGateStatus: 'ensure-only',
  expectedGateNextRequiredAction: 'typical-page:preflight',
  expectedGateCanAutoRecover: true,
  expectedGateStaleInputs: ['package.json'],
}

const STRUCTURED_DETAIL_POSITIVE_SCENARIO = {
  id: 'structured-detail-positive',
  label: 'Structured full-page-detail writes successfully when detail sections provide page semantics',
  validationKind: 'generation',
  pageTypeId: 'full-page-detail',
  title: '典型页真实项目验证详情页',
  dest: 'src/pages/typical-real-project/detail-page',
  routePath: 'typical-real-project-detail-page',
  detailSections: [
    {
      kind: 'description-group',
      title: '基础信息',
      dataKey: 'basicInfo',
      fields: [
        { label: '单据编号', key: 'documentNo' },
        { label: '单据状态', key: 'status' },
      ],
    },
    {
      kind: 'data-table',
      title: '处理记录',
      dataKey: 'processingTimeline',
      columns: [
        { label: '处理时间', key: 'handledAt', width: 180 },
        { label: '处理动作', key: 'action', width: 160 },
        { label: '状态', key: 'status', width: 120 },
      ],
    },
  ],
  navigationMountContract: HOST_INTEGRATION_REGISTRY_CONTRACT,
  expectedOutcome: 'written',
  expectedTemplatePass: 'pass',
  expectedEngineeringPass: 'pass',
  expectedNavigationFlowPass: 'pass',
  expectedBusinessSemanticPass: 'pass',
  expectedTechnicalPass: 'pass',
  expectedBusinessPass: 'pass',
  force: true,
}

const GENERIC_FORM_REVIEW_SCENARIO = {
  id: 'generic-form-review',
  label: 'Generic full-page-edit writes with auto-supplemented page-type semantics and requires follow-up review',
  validationKind: 'generation',
  pageTypeId: 'full-page-edit',
  title: '典型页真实项目验证编辑页',
  dest: 'src/pages/typical-real-project/edit-page',
  routePath: 'typical-real-project-edit-page',
  navigationMountContract: HOST_INTEGRATION_REGISTRY_CONTRACT,
  expectedOutcome: 'written',
  force: true,
}

const SAME_MODULE_SUBVIEW_MANAGED_PUBLISH_ENTRY_SCENARIO = {
  id: 'same-module-subview-managed-mf-publish-entry',
  label:
    'Legacy direct-expose same-module-subview keeps parent-page business relation but delivers runtime styles through a managed Module Federation publish entry',
  validationKind: 'generation',
  pageTypeId: 'table-basic',
  title: '典型页真实项目验证子页受管发布入口',
  dest: 'src/views/special-approval/typical-real-project-managed-publish-entry',
  relatedPagePath: 'src/views/special-approval/index.jsx',
  expectedOutcome: 'written',
  expectedStyleDeliveryOwner: 'managed-publish-entry',
  expectedStyleDeliveryVerified: true,
  generationEntry: 'single-entry',
  setupFixtureId: 'managed-mf-existing-system',
  setupFiles: [
    {
      path: 'src/views/special-approval/index.jsx',
      content: `export function openTypicalRealProjectManagedPublishEntry() {
  return window.addPage({
    title: '典型页真实项目验证子页受管发布入口',
    path: '@common/TypicalRealProjectManagedPublishEntry',
  })
}
`,
    },
    {
      path: 'src/views/attendance-center/index.jsx',
      content: `export function openAttendanceFromAttendanceCenter() {
  return window.addPage({
    title: '考勤管理',
    path: '@common/AttendanceManagement',
  })
}
`,
    },
    {
      path: 'src/layouts/index.jsx',
      content: 'export default function LegacyLayout() { return null }\n',
    },
    {
      path: 'src/pages/legacy-dashboard/index.jsx',
      content: 'export default function LegacyDashboardPage() { return null }\n',
    },
  ],
  force: true,
}

const SAME_MODULE_SUBVIEW_PARENT_ENTRY_PROOF_SCENARIO = {
  id: 'same-module-subview-parent-entry-proof',
  label: 'Same-module-subview can keep parent-entry style ownership when parent proof is explicit',
  validationKind: 'generation',
  pageTypeId: 'table-basic',
  title: '典型页真实项目验证父入口样式归属',
  dest: 'src/features/typical-real-project-parent/child-page',
  relatedPagePath: 'src/features/typical-real-project-parent/index.jsx',
  expectedOutcome: 'written',
  expectedStyleDeliveryOwner: 'parent-entry',
  expectedStyleDeliveryVerified: true,
  setupFiles: [
    {
      path: 'src/layouts/index.jsx',
      content: 'export default function ExistingLayout() { return null }\n',
    },
    {
      path: 'src/router/index.jsx',
      content: 'export const routes = []\n',
    },
    {
      path: 'src/features/typical-real-project-parent/index.jsx',
      content: `import '../../components/hiui-design-runtime/styles.css'

export default function TypicalRealProjectParent() {
  return null
}
`,
    },
  ],
  force: true,
}

const SAME_MODULE_SUBVIEW_MISSING_STYLE_OWNER_PROOF_SCENARIO = {
  id: 'same-module-subview-missing-style-owner-proof',
  label: 'Same-module-subview parent-entry verification fails when the declared owner does not import styles',
  validationKind: 'generation',
  pageTypeId: 'table-basic',
  title: '典型页真实项目验证父入口缺失样式',
  dest: 'src/features/typical-real-project-missing-style/child-page',
  relatedPagePath: 'src/features/typical-real-project-missing-style/index.jsx',
  expectedOutcome: 'written',
  expectedStyleDeliveryOwner: 'parent-entry',
  expectedStyleDeliveryVerified: false,
  setupFiles: [
    {
      path: 'src/layouts/index.jsx',
      content: 'export default function ExistingLayout() { return null }\n',
    },
    {
      path: 'src/router/index.jsx',
      content: 'export const routes = []\n',
    },
    {
      path: 'src/features/typical-real-project-missing-style/index.jsx',
      content: `export default function TypicalRealProjectMissingStyle() {
  return null
}
`,
    },
  ],
  force: true,
}

const SAME_MODULE_SUBVIEW_AUTO_PATCHABLE_SCENARIO = {
  id: 'same-module-subview-auto-patchable',
  label:
    'Same-module-subview auto-patches a hiui-generated parent trigger when parentFlowContract is complete and the parent matches the whitelist',
  validationKind: 'generation',
  pageTypeId: 'full-page-detail',
  title: '典型页真实项目验证自动父流转详情页',
  dest: 'src/pages/typical-real-project-parent-flow-auto/detail',
  relatedPagePath: 'src/pages/typical-real-project-parent-flow-auto/index.tsx',
  detailSections: [
    {
      kind: 'description-group',
      title: '基础信息',
      dataKey: 'basicInfo',
      fields: [
        { label: '报销单号', key: 'reimbursementNo' },
        { label: '申请状态', key: 'status' },
        { label: '申请人', key: 'applicantName' },
      ],
    },
    {
      kind: 'data-table',
      title: '审批记录',
      dataKey: 'approvalTimeline',
      columns: [
        { label: '审批时间', key: 'handledAt', width: 180 },
        { label: '处理动作', key: 'action', width: 160 },
        { label: '处理人', key: 'operatorName', width: 140 },
      ],
    },
  ],
  navigationMountContract: {
    ...HOST_INTEGRATION_REGISTRY_CONTRACT,
    parentFlowContract: {
      parentPagePath: 'src/pages/typical-real-project-parent-flow-auto/index.tsx',
      triggerKind: 'table-row-view',
      triggerLocator: {
        actionLabel: '查看',
        columnKey: '_actions',
      },
      targetPathPattern: 'typical-real-project-parent-flow-auto/detail/:reimbursementNo',
      paramMap: {
        reimbursementNo: 'reimbursementNo',
      },
      backBehavior: 'browser-history-back',
    },
  },
  setupFiles: [
    {
      path: 'src/pages/typical-real-project-parent-flow-auto/index.tsx',
      content: `import { Button, Message, Space } from '@hi-ui/hiui'
import '../../components/hiui-design-runtime/styles.css'
import { useNavigate } from 'react-router-dom'

function useTranslation() {
  return {
    t(value) {
      return value
    },
  }
}

export default function TypicalRealProjectParentFlowAutoPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const rows = [{ reimbursementNo: 'BX-001' }]

  return (
    <div>
      {rows.map((row) => (
        <Space key={row.reimbursementNo}>
          <Button
            type="primary"
            appearance="link"
            onClick={() => Message.open({ title: \`\${t('查看报销单')} \${row.reimbursementNo}\` })}
          >
            {t('查看')}
          </Button>
        </Space>
      ))}
    </div>
  )
}
`,
    },
    {
      path: 'src/pages/typical-real-project-parent-flow-auto/hiui-pagegen.meta.json',
      content: `{
  "schemaVersion": "hiui-pagegen.meta.v1",
  "sourceSkill": "hiui-design",
  "command": "generate-page-from-brief",
  "contentSourcePath": "src/pages/typical-real-project-parent-flow-auto/index.tsx"
}
`,
    },
  ],
  expectedOutcome: 'written',
  expectedParentFlowPatchStatus: 'auto-patched-parent-trigger',
  expectedBackNavigationStrategy: 'browser-history-back',
  expectedManualPatchSuggestion: false,
  expectedParentSourcePath: 'src/pages/typical-real-project-parent-flow-auto/index.tsx',
  expectedParentSourceIncludes: [
    'navigate(`typical-real-project-parent-flow-auto/detail/${encodeURIComponent(row.reimbursementNo)}`)',
  ],
  expectedTemplatePass: 'pass',
  expectedEngineeringPass: 'pass',
  expectedTechnicalPass: 'pass',
  force: true,
}

const SAME_MODULE_SUBVIEW_MANUAL_PATCH_SCENARIO = {
  id: 'same-module-subview-manual-patch',
  label:
    'Same-module-subview falls back to manualPatchSuggestion when the parent cannot be proven as a hiui-generated whitelist match',
  validationKind: 'generation',
  pageTypeId: 'full-page-detail',
  title: '典型页真实项目验证人工父流转详情页',
  dest: 'src/pages/typical-real-project-parent-flow-manual/detail',
  relatedPagePath: 'src/pages/typical-real-project-parent-flow-manual/index.tsx',
  detailSections: [
    {
      kind: 'description-group',
      title: '基础信息',
      dataKey: 'basicInfo',
      fields: [
        { label: '报销单号', key: 'reimbursementNo' },
        { label: '申请状态', key: 'status' },
        { label: '申请人', key: 'applicantName' },
      ],
    },
    {
      kind: 'data-table',
      title: '审批记录',
      dataKey: 'approvalTimeline',
      columns: [
        { label: '审批时间', key: 'handledAt', width: 180 },
        { label: '处理动作', key: 'action', width: 160 },
        { label: '处理人', key: 'operatorName', width: 140 },
      ],
    },
  ],
  navigationMountContract: {
    ...HOST_INTEGRATION_REGISTRY_CONTRACT,
    parentFlowContract: {
      parentPagePath: 'src/pages/typical-real-project-parent-flow-manual/index.tsx',
      triggerKind: 'table-row-view',
      triggerLocator: {
        actionLabel: '查看',
        columnKey: '_actions',
      },
      targetPathPattern: 'typical-real-project-parent-flow-manual/detail/:reimbursementNo',
      paramMap: {
        reimbursementNo: 'reimbursementNo',
      },
      backBehavior: 'browser-history-back',
    },
  },
  setupFiles: [
    {
      path: 'src/pages/typical-real-project-parent-flow-manual/index.tsx',
      content: `import { Button, Message, Space } from '@hi-ui/hiui'
import '../../components/hiui-design-runtime/styles.css'

function useTranslation() {
  return {
    t(value) {
      return value
    },
  }
}

export default function TypicalRealProjectParentFlowManualPage() {
  const { t } = useTranslation()
  const rows = [{ reimbursementNo: 'BX-002' }]

  return (
    <div>
      {rows.map((row) => (
        <Space key={row.reimbursementNo}>
          <Button
            type="primary"
            appearance="link"
            onClick={() => Message.open({ title: \`\${t('查看报销单')} \${row.reimbursementNo}\` })}
          >
            {t('查看')}
          </Button>
        </Space>
      ))}
    </div>
  )
}
`,
    },
  ],
  expectedOutcome: 'written',
  expectedParentFlowPatchStatus: 'manual-parent-trigger-patch-required',
  expectedBackNavigationStrategy: 'browser-history-back',
  expectedManualPatchSuggestion: true,
  expectedManualPatchSuggestionStatus: 'manual-parent-trigger-patch-required',
  expectedParentSourcePath: 'src/pages/typical-real-project-parent-flow-manual/index.tsx',
  expectedParentSourceIncludes: [
    "Message.open({ title: `${t('查看报销单')} ${row.reimbursementNo}` })",
  ],
  force: true,
}

const MANAGED_RUNTIME_SECOND_PAGE_NO_IDENTICAL_REWRITE_SCENARIO = {
  id: 'managed-runtime-second-page-no-identical-rewrite',
  label:
    'Subsequent page generation skips identical hiui-design runtime files and reports planned vs written counts',
  validationKind: 'managed-runtime-second-page-no-identical-rewrite',
  pageTypeId: 'table-basic',
  expectedOutcome: 'written',
  steps: [
    {
      pageTypeId: 'table-basic',
      title: '典型页真实项目验证运行时首个列表页',
      dest: 'src/pages/typical-real-project-managed-runtime/first-page',
      routePath: 'typical-real-project-managed-runtime-first-page',
      navigationMountContract: HOST_INTEGRATION_REGISTRY_CONTRACT,
    },
    {
      pageTypeId: 'full-page-detail',
      title: '典型页真实项目验证运行时第二个详情页',
      dest: 'src/pages/typical-real-project-managed-runtime/second-page',
      routePath: 'typical-real-project-managed-runtime-second-page',
      navigationMountContract: HOST_INTEGRATION_REGISTRY_CONTRACT,
      detailSections: [
        {
          kind: 'description-group',
          title: '基础信息',
          dataKey: 'summary',
          fields: [
            { label: '单据编号', key: 'documentNo' },
            { label: '状态', key: 'status' },
          ],
        },
      ],
    },
  ],
  expectedSkippedIdenticalFileCountMin: 1,
  expectedManagedRuntimeFilesSkippedAsIdenticalMin: 1,
  expectedPlannedGreaterThanWritten: true,
  expectedTemplatePass: 'pass',
  expectedEngineeringPass: 'pass',
  expectedNavigationFlowPass: 'pass',
  expectedTechnicalPass: 'pass',
  force: true,
}

const SEMANTIC_PLACEHOLDER_DEGRADED_REPORT_SCENARIO = {
  id: 'semantic-placeholder-degraded-report',
  label:
    'Full-page-detail still writes with detail sections present, but reports businessSemanticPass=placeholder when content remains placeholder-like',
  validationKind: 'generation',
  pageTypeId: 'full-page-detail',
  title: '典型页真实项目验证语义占位详情页',
  dest: 'src/pages/typical-real-project/semantic-placeholder-detail',
  routePath: 'typical-real-project-semantic-placeholder-detail',
  detailSections: [
    {
      kind: 'description-group',
      title: '概览1',
      dataKey: 'overview1',
      fields: [
        { label: '字段1', key: 'field1' },
        { label: '字段2', key: 'field2' },
      ],
    },
    {
      kind: 'data-table',
      title: '概览2',
      dataKey: 'table1',
      columns: [
        { label: '字段1', key: 'field1', width: 180 },
        { label: '字段2', key: 'field2', width: 180 },
      ],
    },
  ],
  navigationMountContract: HOST_INTEGRATION_REGISTRY_CONTRACT,
  expectedOutcome: 'written',
  expectedTemplatePass: 'pass',
  expectedEngineeringPass: 'pass',
  expectedNavigationFlowPass: 'pass',
  expectedBusinessSemanticPass: 'placeholder',
  expectedTechnicalPass: 'pass',
  expectedBusinessPass: 'fail',
  force: true,
}

const SCENARIOS = [
  GATE_STALE_BUT_RECOVERABLE_SCENARIO,
  STRUCTURED_DETAIL_POSITIVE_SCENARIO,
  GENERIC_FORM_REVIEW_SCENARIO,
  SAME_MODULE_SUBVIEW_PARENT_ENTRY_PROOF_SCENARIO,
  SAME_MODULE_SUBVIEW_MISSING_STYLE_OWNER_PROOF_SCENARIO,
  SAME_MODULE_SUBVIEW_AUTO_PATCHABLE_SCENARIO,
  SAME_MODULE_SUBVIEW_MANUAL_PATCH_SCENARIO,
  MANAGED_RUNTIME_SECOND_PAGE_NO_IDENTICAL_REWRITE_SCENARIO,
  SEMANTIC_PLACEHOLDER_DEGRADED_REPORT_SCENARIO,
]

export function listTypicalRealProjectValidationScenarios() {
  return SCENARIOS.map((scenario) => ({
    ...cloneJson(scenario),
  }))
}

export function getTypicalRealProjectValidationScenario(id) {
  const scenario = SCENARIOS.find((item) => item.id === id)
  if (!scenario) {
    throw new Error(`Unknown typical real project validation scenario: ${id}`)
  }

  return cloneJson(scenario)
}
