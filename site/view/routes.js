import React from 'react'

import Home from './Home'
import HomeEn from './Home/en-US'
import { SiderLayout } from '@hi-ui/classic-theme'
import Component from './Component'

const loop = (locale, items, targets, component) => {
  items.forEach(item => {
    if (item.to) {
      console.log('to', item.to)
      targets.push({
        path: `/hiui/${locale}/${item.to.split('/')[3]}/${item.to.split('/')[4]}`,
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
      path: `/hiui/zh-CN`,
      component: Home,
      exact: true
    },
    {
      path: `/hiui/en-US`,
      component: HomeEn,
      exact: true
    },
    {
      path: `/hiui/${locale}/designs`,
      render: props => {
        return <SiderLayout deepClone={false} sider={designs} routes={desArr} {...props} />
      }
    },
    {
      path: `/hiui/${locale}/templates`,
      render: props => {
        return <SiderLayout deepClone={false} sider={templates} routes={templateArr} {...props} />
      }
    },
    {
      path: `/hiui/${locale}/docs`,
      render: props => {
        return <SiderLayout deepClone={false} sider={siders} routes={sideArr} {...props} />
      }
    }
  ]
}

export default getRoutes
