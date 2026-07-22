/* hiui-pagegen generation-mode: __GENERATION_MODE__ */
/* hiui-pagegen generation-strategy: managed-analytics */
/* hiui-pagegen asset profile: managed-analytics-shell */
/* hiui-pagegen delivery role: managed-analytics-business-shell */
/* hiui-pagegen template marker: __PAGE_TYPE__ */
import React from 'react'
import {
  CanonicalDataVisualizationPage,
  type DataVisualizationSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as DataVisualizationSchema

function __PAGE_COMPONENT__ProbePage() {
  return <CanonicalDataVisualizationPage schema={schema} className={styles.pageRoot} />
}

export default __PAGE_COMPONENT__ProbePage
