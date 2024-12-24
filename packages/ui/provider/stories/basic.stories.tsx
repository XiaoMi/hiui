import React from 'react'
import Provider, { DesignSystemAccentColorEnum } from '../src'
import { LocaleEnum } from '@hi-ui/locale-context'
import Pagination from '@hi-ui/pagination'
import Select from '@hi-ui/select'
import { Row, Col } from '@hi-ui/grid'
import Alert from '@hi-ui/alert'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const [locale, setLocale] = React.useState<LocaleEnum>()
  const [accentColor, setAccentColor] = React.useState<DesignSystemAccentColorEnum>()

  return (
    <>
      <h1>基础用法</h1>
      <div className="provider-basic__wrap">
        <Alert title="在 APP 最外层包裹使用，用于主色、国际化、圆角、边框、特效等主题设置"></Alert>
        <Provider locale={locale} accentColor={accentColor} theme={{}}>
          <Row gutter style={{ marginTop: 20, marginBottom: 20 }}>
            <Col span={6}>
              <Select
                placeholder="语言"
                data={[
                  {
                    id: 'zh-CN',
                    title: '中文',
                  },
                  {
                    id: 'zh-TW',
                    title: '繁体',
                  },
                  {
                    id: 'en-US',
                    title: 'English',
                  },
                ]}
                value={locale}
                onChange={(val) => setLocale(val as LocaleEnum)}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="配色"
                data={[
                  {
                    id: 'brandblue',
                    title: '品牌蓝',
                  },
                  {
                    id: 'ultramarine',
                    title: '深蓝',
                  },
                  {
                    id: 'pastelblue',
                    title: '浅蓝',
                  },
                  {
                    id: 'skyblue',
                    title: '天空蓝',
                  },
                  {
                    id: 'orange',
                    title: '活力橙',
                  },
                  {
                    id: 'amber',
                    title: '琥珀',
                  },
                  {
                    id: 'purple',
                    title: '紫罗兰',
                  },
                  {
                    id: 'cyan',
                    title: '橘青',
                  },
                ]}
                value={accentColor}
                onChange={(val) => setAccentColor(val as DesignSystemAccentColorEnum)}
              />
            </Col>
          </Row>
          <Pagination
            total={200}
            pageSize={10}
            showTotal
            showJumper
            pageSizeOptions={[10, 20, 50, 100]}
          />
        </Provider>
      </div>
    </>
  )
}
