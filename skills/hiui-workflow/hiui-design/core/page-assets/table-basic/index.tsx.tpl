/* hiui-pagegen generation-mode: __GENERATION_MODE__ */
/* hiui-pagegen reference mode: __REFERENCE_ASSET_MODE__ */
/* hiui-pagegen reference source: __REFERENCE_ASSET_SOURCE__ */
/* hiui-pagegen reference registry: __REFERENCE_PAGE_TYPE_REGISTRY__ */
/* hiui-pagegen reference example: __REFERENCE_EXAMPLE_PATH__ */
/* hiui-pagegen reference asset example: __REFERENCE_ASSET_EXAMPLE_PATH__ */
/* hiui-pagegen reference shell: __REFERENCE_SHELL__ */
/* reference shell: __REFERENCE_SHELL__ */
/* hiui-pagegen reference template asset: __REFERENCE_TEMPLATE_ASSET_SOURCE__ */
/* hiui-pagegen reference canonical component: __REFERENCE_CANONICAL_COMPONENT_PATH__ */
/* data-hiui-pagegen-template="__PAGE_TYPE__" */
import React from 'react'
import {
  CanonicalTableBasicPage,
  type TableBasicSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as TableBasicSchema

function TableBasicPage() {
  return <CanonicalTableBasicPage schema={schema} className={styles.pageRoot} />
}

export default TableBasicPage
