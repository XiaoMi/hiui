import React from 'react'
import {
  CanonicalFeedbackStatusPage,
  type FeedbackStatusSchema,
} from '__CANONICAL_COMPONENT_IMPORT__'
import pageSchema from './page.schema.json'
import styles from './index.module.scss'

const schema = pageSchema as FeedbackStatusSchema

function __PAGE_COMPONENT__ProbePage() {
  return <CanonicalFeedbackStatusPage schema={schema} className={styles.pageRoot} />
}

export default __PAGE_COMPONENT__ProbePage
