import fs from 'node:fs/promises'
import path from 'node:path'

import {
  buildManagedMfPublishEntryContent,
  buildManagedMfPublishEntryImportPlan,
  inferManagedBusinessShellImportPath,
  looksLikeManagedMfPublishEntryContent,
} from './managed-mf-publish-entry-template.mjs'
import {
  inferManagedMfPublishEntryFileName,
  inferManagedMfPublishEntryRelativePath,
} from './host-adapters/mf-direct-expose-legacy.mjs'
import { toSkillSourceTag } from './skill-identity.mjs'

function normalizeRelativePath(value) {
  return String(value || '')
    .replace(/\\/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/')
}

function normalizeString(value) {
  return String(value || '').trim()
}

async function isReadableFile(targetPath) {
  try {
    const stat = await fs.stat(targetPath)
    return stat.isFile()
  } catch {
    return false
  }
}

function buildEmptyManagedMfPublishEntryPlan() {
  return {
    files: [],
    managedMfPublishEntry: {
      required: false,
      path: '',
      fileName: '',
      importsShellStyles: false,
      importsReactCompatPatch: false,
      appEntryPath: '',
    },
  }
}

export async function collectManagedMfPublishEntryFiles({ brief, targetRoot, destDir }) {
  const navigationMountAction = brief.pageGenerationDecision?.navigationMountAction
  const publishDeliveryDecision = brief.pageGenerationDecision?.publishDeliveryDecision || {}
  const hostExecutionAdapter = brief.pageGenerationDecision?.hostExecutionAdapter || null
  if (
    navigationMountAction?.action !== 'materialize-mf-publish-entry' &&
    normalizeString(publishDeliveryDecision?.kind) !== 'managed-mf-publish-entry'
  ) {
    return buildEmptyManagedMfPublishEntryPlan()
  }

  const targetBusinessPath = normalizeRelativePath(
    hostExecutionAdapter?.pageSource?.targetBusinessPath ||
      brief?.requestedBusiness?.targetBusinessPath ||
      brief?.requestedBusiness?.dest ||
      ''
  )
  const fileName =
    normalizeString(hostExecutionAdapter?.publishEntry?.managedPublishEntryFileName) ||
    inferManagedMfPublishEntryFileName({
      preferredTemplatePath: brief?.sources?.preferredTemplatePath || '',
    })
  const appEntryPath = normalizeRelativePath(navigationMountAction.appEntryPath || '')
  const absoluteAppEntryPath = appEntryPath ? path.join(targetRoot, appEntryPath) : ''
  const appEntrySource =
    absoluteAppEntryPath && (await isReadableFile(absoluteAppEntryPath))
      ? await fs.readFile(absoluteAppEntryPath, 'utf8')
      : ''
  const importPlan = buildManagedMfPublishEntryImportPlan({
    appEntrySource,
    hostProfile: brief.hostProfile,
  })
  const managedMfPublishEntryPath =
    normalizeRelativePath(hostExecutionAdapter?.publishEntry?.managedPublishEntryPath) ||
    inferManagedMfPublishEntryRelativePath({
      targetBusinessPath,
      preferredTemplatePath: brief?.sources?.preferredTemplatePath || '',
    })
  const shellImportPath = inferManagedBusinessShellImportPath(managedMfPublishEntryPath)
  const usesJavaScriptModule = fileName.endsWith('.jsx')
  const destPath = managedMfPublishEntryPath
    ? path.join(targetRoot, managedMfPublishEntryPath)
    : path.join(destDir, fileName)
  const nextContent = buildManagedMfPublishEntryContent({
    importPlan,
    shellImportPath,
    publishEntryPath: managedMfPublishEntryPath,
    usesJavaScriptModule,
    hostProfile: brief.hostProfile,
  })
  const existingDestSource =
    (await isReadableFile(destPath))
      ? await fs.readFile(destPath, 'utf8')
      : ''
  const allowManagedOverwrite =
    existingDestSource === nextContent ||
    looksLikeManagedMfPublishEntryContent(existingDestSource)

  return {
    files: [
      {
        sourcePath: toSkillSourceTag('generated-mf-publish-entry'),
        destPath,
        content: nextContent,
        allowManagedOverwrite,
      },
    ],
    managedMfPublishEntry: {
      required: true,
      path: managedMfPublishEntryPath,
      fileName,
      importsShellStyles: importPlan.importsShellStyles === true,
      importsReactCompatPatch: importPlan.importsReactCompatPatch === true,
      appEntryPath,
    },
  }
}
