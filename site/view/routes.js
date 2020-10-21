import React from 'react'

import Home from './Home'
import HomeEn from './Home/en-US'
import { SiderLayout } from '@hi-ui/classic-theme'
import Component from './Component'

const loop = (locale, items, targets, component) => {
  items.forEach((item) => {
    if (item.to) {
      targets.push({
        path: item.to,
        component: component
      })
    }
    if (item.children) {
      loop(locale, item.children, targets, component)
    }
  })
  return targets
}
function getRoutes(locale, siders, designs, templates, docs) {
  let sideArr = []
  let desArr = []
  let templateArr = []
  let docArr = []
  sideArr = loop(locale, siders, sideArr, Component)
  desArr = loop(locale, designs, desArr, Component)
  docArr = loop(locale, docs, docArr, Component)
  templateArr = loop(locale, templates, templateArr, Component)
  return [
    {
      path: `<BASE_URL>/zh-CN`,
      component: Home,
      exact: true
    },
    {
      path: `<BASE_URL>/en-US`,
      component: HomeEn,
      exact: true
    },
    {
      path: `<BASE_URL>/${locale}/designs`,
      render: (props) => {
        return <SiderLayout deepClone={false} sider={designs} routes={desArr} {...props} />
      }
    },
    {
      path: `<BASE_URL>/${locale}/templates`,
      render: (props) => {
        return <SiderLayout deepClone={false} sider={templates} routes={templateArr} {...props} />
      }
    },
    {
      path: `<BASE_URL>/${locale}/docs`,
      render: (props) => {
        return <SiderLayout deepClone={false} sider={docs} routes={docArr} {...props} />
      }
    },
    {
      path: `<BASE_URL>/${locale}/components`,
      render: (props) => {
        return <SiderLayout deepClone={false} sider={siders} routes={sideArr} {...props} />
      }
    }
  ]
}

export default getRoutes
