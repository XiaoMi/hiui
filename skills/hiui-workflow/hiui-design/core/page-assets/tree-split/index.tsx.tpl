import React from 'react'
import {
  CanonicalTreeSplitPage,
  type TreeSplitSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as TreeSplitSchema

function __PAGE_COMPONENT__ProbePage() {
  return <CanonicalTreeSplitPage schema={schema} className={styles.pageRoot} />
}

export default __PAGE_COMPONENT__ProbePage
