import React from 'react'

import Home from './Home'
import HomeEn from './Home/en-US'
import { SiderLayout } from '@hi-ui/classic-theme'
import Component from './Component'

const loop = (locale, items, targets, component) => {
  items.forEach(item => {
    if (item.to) {
      targets.push({
        path: `/${locale}/${item.to.split('/')[2]}/${item.to.split('/')[3]}`,
        component: component
      })
    }
    if (item.children) {
      loop(locale, item.children, targets, component)
    }
  })
  return targets
}
function getRoutes (locale, siders, designs, templates) {
  let sideArr = []
  let desArr = []
  let templateArr = []
  sideArr = loop(locale, siders, sideArr, Component)
  desArr = loop(locale, designs, desArr, Component)
  templateArr = loop(locale, templates, templateArr, Component)
  return [
    {
      path: `/zh-CN`,
      component: Home,
      exact: true
    },
    {
      path: `/en-US`,
      component: HomeEn,
      exact: true
    },
    {
      path: `/${locale}/designs`,
      render: props => {
        return <SiderLayout deepClone={false} sider={designs} routes={desArr} {...props} />
      }
    },
    {
      path: `/${locale}/templates`,
      render: props => {
        return <SiderLayout deepClone={false} sider={templates} routes={templateArr} {...props} />
      }
    },
    {
      path: `/${locale}/docs`,
      render: props => {
        return <SiderLayout deepClone={false} sider={siders} routes={sideArr} {...props} />
      }
    }
  ]
}

export default getRoutes
