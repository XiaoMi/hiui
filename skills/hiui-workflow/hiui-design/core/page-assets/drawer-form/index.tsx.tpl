import React from 'react'
import {
  CanonicalDrawerFormPage,
  type DrawerFormSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as DrawerFormSchema

function DrawerFormPage() {
  return <CanonicalDrawerFormPage schema={schema} className={styles.pageRoot} />
}

export default DrawerFormPage
