import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import {
  buildGenerationDeliveryStatus,
  buildManagedPageDeliveryStatus,
  resolveDeliveryBindingStatus,
} from '../generators/delivery-status.mjs'
import { REPO_ROOT } from '../generators/shared.mjs'

const PROJECT_INTEGRATION_STATE_PATH = path.resolve(
  REPO_ROOT,
  '.local-context/hiui-design/outputs/project-integration-state.json'
)

async function withTemporaryPageFile(relativePath, source, run) {
  const absolutePath = path.resolve(REPO_ROOT, relativePath)
  const existed = await fs
    .access(absolutePath)
    .then(() => true)
    .catch(() => false)
  const previousContent = existed ? await fs.readFile(absolutePath, 'utf8') : null

  await fs.mkdir(path.dirname(absolutePath), { recursive: true })
  await fs.writeFile(absolutePath, source, 'utf8')

  try {
    return await run()
  } finally {
    if (existed) {
      await fs.writeFile(absolutePath, previousContent, 'utf8')
    } else {
      await fs.rm(absolutePath, { force: true })
    }
  }
}

async function withTemporaryFile(filePath, content, run) {
  const existed = await fs
    .access(filePath)
    .then(() => true)
    .catch(() => false)
  const previousContent = existed ? await fs.readFile(filePath, 'utf8') : null

  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')

  try {
    return await run()
  } finally {
    if (existed) {
      await fs.writeFile(filePath, previousContent, 'utf8')
    } else {
      await fs.rm(filePath, { force: true })
    }
  }
}

test('resolveDeliveryBindingStatus reads certified binding evidence from project integration state', async () => {
  const pagePath = `src/views/hiui-pagegen-probe/delivery-binding-ready-${process.pid}-${Date.now()}/index.tsx`

  await withTemporaryPageFile(
    pagePath,
    `export default function DeliveryBindingReadyPage() {
  return <div data-hiui5-page-type="table-basic" />
}
`,
    async () => {
      await withTemporaryFile(
        PROJECT_INTEGRATION_STATE_PATH,
        `${JSON.stringify(
          {
            status: 'integrated',
            mode: 'legacy-host-compatible',
            integrationReady: true,
            carrierValidation: {
              status: 'ready',
              registryPath: '.local-context/hiui-design/outputs/project-delivery-plugin-registry.json',
            },
            legacyBridgeValidation: {
              status: 'ready',
            },
            requiredLegacyPageTypes: ['table-basic'],
            certifiedLegacyPageTypes: ['table-basic'],
            missingRequiredLegacyPageTypes: [],
            legacyRolloutCoverageStatus: 'ready',
          },
          null,
          2
        )}\n`,
        async () => {
          const result = resolveDeliveryBindingStatus(pagePath)

          assert.equal(result.bindingReady, true)
          assert.equal(result.status, 'ready')
          assert.equal(result.reason, 'integration-state-certifies-legacy-delivery-binding')
          assert.ok(
            result.evidencePaths.includes('.local-context/hiui-design/outputs/project-integration-state.json')
          )
          assert.ok(result.evidencePaths.includes(pagePath))
        }
      )
    }
  )
})

test('resolveDeliveryBindingStatus fails closed when a required legacy page type lacks certified binding proof', async () => {
  const pagePath = `src/views/hiui-pagegen-probe/delivery-binding-missing-${process.pid}-${Date.now()}/index.tsx`

  await withTemporaryPageFile(
    pagePath,
    `/* hiui-design page-type: full-page-detail */
export default function DeliveryBindingMissingPage() {
  return <div />
}
`,
    async () => {
      await withTemporaryFile(
        PROJECT_INTEGRATION_STATE_PATH,
        `${JSON.stringify(
          {
            status: 'integrated',
            mode: 'legacy-host-compatible',
            integrationReady: true,
            carrierValidation: {
              status: 'ready',
              registryPath: '.local-context/hiui-design/outputs/project-delivery-plugin-registry.json',
            },
            legacyBridgeValidation: {
              status: 'ready',
            },
            requiredLegacyPageTypes: ['full-page-detail'],
            certifiedLegacyPageTypes: ['table-basic'],
            missingRequiredLegacyPageTypes: ['full-page-detail'],
            legacyRolloutCoverageStatus: 'blocked',
          },
          null,
          2
        )}\n`,
        async () => {
          const result = resolveDeliveryBindingStatus(pagePath)

          assert.equal(result.bindingReady, false)
          assert.equal(result.status, 'pending')
          assert.equal(result.reason, 'legacy-delivery-binding-page-type-not-certified')
          assert.ok(result.evidencePaths.includes(pagePath))
        }
      )
    }
  )
})

test('resolveDeliveryBindingStatus stays pending without integration-state evidence', async () => {
  const existed = await fs
    .access(PROJECT_INTEGRATION_STATE_PATH)
    .then(() => true)
    .catch(() => false)
  const previous = existed ? await fs.readFile(PROJECT_INTEGRATION_STATE_PATH, 'utf8') : null

  try {
    await fs.rm(PROJECT_INTEGRATION_STATE_PATH, { force: true })
    assert.equal(resolveDeliveryBindingStatus('src/views/foo/detail').bindingReady, false)
    assert.equal(resolveDeliveryBindingStatus('src/views/foo/detail').status, 'pending')
    assert.equal(
      resolveDeliveryBindingStatus('src/views/foo/detail').reason,
      'project-integration-state-missing'
    )
  } finally {
    if (existed) {
      await fs.writeFile(PROJECT_INTEGRATION_STATE_PATH, previous, 'utf8')
    }
  }
})

test('resolveDeliveryBindingStatus fails closed when legacy binding coverage exists but the page type cannot be resolved', async () => {
  const pagePath = `src/views/hiui-pagegen-probe/delivery-binding-unresolved-${process.pid}-${Date.now()}/index.tsx`

  await withTemporaryPageFile(
    pagePath,
    `export default function DeliveryBindingUnresolvedPage() {
  return <div />
}
`,
    async () => {
      await withTemporaryFile(
        PROJECT_INTEGRATION_STATE_PATH,
        `${JSON.stringify(
          {
            status: 'integrated',
            mode: 'legacy-host-compatible',
            integrationReady: true,
            carrierValidation: {
              status: 'ready',
              registryPath: '.local-context/hiui-design/outputs/project-delivery-plugin-registry.json',
            },
            legacyBridgeValidation: {
              status: 'ready',
            },
            requiredLegacyPageTypes: ['table-basic'],
            certifiedLegacyPageTypes: ['table-basic'],
            missingRequiredLegacyPageTypes: [],
            legacyRolloutCoverageStatus: 'ready',
          },
          null,
          2
        )}\n`,
        async () => {
          const result = resolveDeliveryBindingStatus(pagePath)

          assert.equal(result.bindingReady, false)
          assert.equal(result.status, 'pending')
          assert.equal(result.reason, 'legacy-delivery-binding-page-type-unresolved')
        }
      )
    }
  )
})

test('generate output distinguishes result readiness from legacy binding and release readiness', async () => {
  const page = `src/views/hiui-pagegen-probe/delivery-status-${process.pid}-${Date.now()}`

  await withTemporaryFile(
    PROJECT_INTEGRATION_STATE_PATH,
    `${JSON.stringify(
      {
        status: 'integrated',
        integrationReady: false,
        carrierValidation: {
          status: 'blocked',
          registryPath: '.local-context/hiui-design/outputs/project-delivery-plugin-registry.json',
        },
        legacyBridgeValidation: {
          status: 'blocked',
        },
      },
      null,
      2
    )}\n`,
    async () => {
      const output = buildGenerationDeliveryStatus({
        targetPagePath: page,
        verifyResult: { status: 'passed' },
      })

      assert.equal(output.deliveryContractVersion, 'delivery-readiness.v2')
      assert.equal(output.deliveryState, 'result-ready')
      assert.equal(output.deliveryReadiness?.assetReady?.status, 'ready')
      assert.equal(output.deliveryReadiness?.resultReady?.status, 'ready')
      assert.equal(output.deliveryReadiness?.bindingReady?.status, 'pending')
      assert.equal(output.deliveryReadiness?.bindingReady?.reason, 'project-integration-not-ready')
      assert.ok(
        output.deliveryReadiness?.bindingReady?.evidencePaths?.includes(
          '.local-context/hiui-design/outputs/project-integration-state.json'
        )
      )
      assert.equal(output.deliveryReadiness?.releaseReady?.status, 'pending')
      assert.deepEqual(output.deliveryReadiness?.releaseReady?.unmetConditions, [
        'legacy-delivery-binding',
        'visual-verification',
      ])
      assert.equal(output.deliveryReadiness?.releaseReady?.visualVerificationStatus, 'not-run')
    }
  )
})

test('managed page delivery status does not overstate readiness before result validation passes', () => {
  const output = buildManagedPageDeliveryStatus({
    targetPagePath: 'src/views/divide-management/divide-query/index.tsx',
    workflow: {
      status: 'contract-written',
      preflightStatus: 'not-run',
      sourceGateStatus: 'not-run',
      doctorStatus: 'not-run',
      runtimeSmokeStatus: 'not-required',
    },
    runtimeSmokeRequired: false,
  })

  assert.equal(output.deliveryState, 'asset-ready')
  assert.equal(output.deliveryReadiness.assetReady.status, 'ready')
  assert.equal(output.deliveryReadiness.resultReady.status, 'pending')
  assert.equal(output.deliveryReadiness.releaseReady.status, 'blocked')
})

test('managed page delivery status reaches result-ready only after preflight passes', () => {
  return withTemporaryFile(
    PROJECT_INTEGRATION_STATE_PATH,
    `${JSON.stringify(
      {
        status: 'integrated',
        integrationReady: false,
        carrierValidation: {
          status: 'blocked',
          registryPath: '.local-context/hiui-design/outputs/project-delivery-plugin-registry.json',
        },
        legacyBridgeValidation: {
          status: 'blocked',
        },
      },
      null,
      2
    )}\n`,
    async () => {
      const output = buildManagedPageDeliveryStatus({
        targetPagePath: 'src/views/divide-management/divide-query/index.tsx',
        workflow: {
          status: 'preflight-pass',
          preflightStatus: 'pass',
          sourceGateStatus: 'not-run',
          doctorStatus: 'not-run',
          runtimeSmokeStatus: 'not-required',
        },
        runtimeSmokeRequired: false,
      })

      assert.equal(output.deliveryState, 'result-ready')
      assert.equal(output.deliveryReadiness.resultReady.status, 'ready')
      assert.equal(output.deliveryReadiness.releaseReady.status, 'pending')
    }
  )
})
