/* hiui-pagegen generation-mode: __GENERATION_MODE__ */
/* hiui-pagegen reference mode: __REFERENCE_ASSET_MODE__ */
/* hiui-pagegen reference source: __REFERENCE_ASSET_SOURCE__ */
/* hiui-pagegen reference registry: __REFERENCE_PAGE_TYPE_REGISTRY__ */
/* hiui-pagegen reference example: __REFERENCE_EXAMPLE_PATH__ */
/* hiui-pagegen reference asset example: __REFERENCE_ASSET_EXAMPLE_PATH__ */
/* hiui-pagegen reference shell: __REFERENCE_SHELL__ */
/* hiui-pagegen reference template asset: __REFERENCE_TEMPLATE_ASSET_SOURCE__ */
/* hiui-pagegen reference canonical component: __REFERENCE_CANONICAL_COMPONENT_PATH__ */
import React from 'react'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'
import { useHostAdapter } from '__HOST_ADAPTER_IMPORT__'
import { OfficialRuntimeEntryPage } from '__RUNTIME_ENTRY_IMPORT__'

function __PAGE_COMPONENT__Page() {
  const hostAdapter = useHostAdapter()

  return (
    <div className={styles.pageRoot} data-hiui-pagegen-template="__PAGE_TYPE__">
      <OfficialRuntimeEntryPage
        hostAdapter={hostAdapter}
        pageType="__PAGE_TYPE__"
        runtimePageId="__OFFICIAL_RUNTIME_PAGE_ID__"
        title="__OFFICIAL_RUNTIME_TITLE__"
        schema={pageSchema}
      />
    </div>
  )
}

export default __PAGE_COMPONENT__Page
