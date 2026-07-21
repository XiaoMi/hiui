import React from 'react'
import {
  CanonicalFullPageEditPage,
  type FullPageEditSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as FullPageEditSchema

function FullPageEditPage() {
  return <CanonicalFullPageEditPage schema={schema} className={styles.pageRoot} />
}

export default FullPageEditPage
