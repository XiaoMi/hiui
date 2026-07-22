import React from 'react'
import {
  CanonicalFullPageDetailPage,
  type FullPageDetailSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as FullPageDetailSchema

function FullPageDetailPage() {
  return <CanonicalFullPageDetailPage schema={schema} className={styles.pageRoot} />
}

export default FullPageDetailPage
