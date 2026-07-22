import React from 'react'
import {
  CanonicalTreeTablePage,
  type TreeTableSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as TreeTableSchema

function __PAGE_COMPONENT__ProbePage() {
  return <CanonicalTreeTablePage schema={schema} className={styles.pageRoot} />
}

export default __PAGE_COMPONENT__ProbePage
