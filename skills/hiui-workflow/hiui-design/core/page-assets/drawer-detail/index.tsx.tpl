import React from 'react'
import {
  CanonicalDrawerDetailPage,
  type DrawerDetailSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as DrawerDetailSchema

function DrawerDetailPage() {
  return <CanonicalDrawerDetailPage schema={schema} className={styles.pageRoot} />
}

export default DrawerDetailPage
