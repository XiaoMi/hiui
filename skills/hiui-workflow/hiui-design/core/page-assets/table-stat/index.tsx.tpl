import React from 'react'
import {
  CanonicalTableStatPage,
  type TableStatSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as TableStatSchema

function TableStatPage() {
  return <CanonicalTableStatPage schema={schema} className={styles.pageRoot} />
}

export default TableStatPage
