import React from 'react'
import Provider, { DesignSystemAccentColorEnum } from '../src'
import { LocaleEnum } from '@hi-ui/locale-context'
import Pagination from '@hi-ui/pagination'
import DatePicker from '@hi-ui/date-picker'
import Select from '@hi-ui/select'
import { Row, Col } from '@hi-ui/grid'
import Alert from '@hi-ui/alert'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const [locale, setLocale] = React.useState<LocaleEnum | undefined>(undefined)
  const [accentColor, setAccentColor] = React.useState<DesignSystemAccentColorEnum>()
  const [date, setDate] = React.useState<Date | null>(null)

  // 所有支持的语言列表
  const languageOptions = [
    // 亚洲语言
    { id: 'zh-CN', title: '中文简体' },
    { id: 'zh-HK', title: '中文（香港）' },
    { id: 'zh-TW', title: '中文繁体（台湾）' },
    { id: 'ja-JP', title: '日语' },
    { id: 'ko-KR', title: '韩语' },
    { id: 'vi-VN', title: '越语' },
    { id: 'th-TH', title: '泰语' },
    // 欧洲语言
    { id: 'en-US', title: '英语' },
    { id: 'pt-PT', title: '葡萄牙语（欧洲）' },
    { id: 'pt-BR', title: '葡萄牙语（巴西）' },
    { id: 'fr-FR', title: '法语' },
    { id: 'de-DE', title: '德语' },
    { id: 'es-ES', title: '西班牙语' },
    { id: 'it-IT', title: '意大利语' },
    { id: 'nl-NL', title: '荷兰语' },
    { id: 'el-GR', title: '希腊语' },
    { id: 'cs-CZ', title: '捷克语' },
    { id: 'da-DK', title: '丹麦语' },
    { id: 'fi-FI', title: '芬兰语' },
    { id: 'tr-TR', title: '土耳其语' },
    // 高加索和中亚语言
    { id: 'hy-AM', title: '亚美尼亚语' },
    { id: 'az-AZ', title: '阿塞拜疆语' },
    { id: 'ru-RU', title: '俄语' },
    { id: 'ka-GE', title: '格鲁吉亚语' },
    { id: 'uz-UZ', title: '乌兹别克语' },
    // 巴尔干语言
    { id: 'bs-BA', title: '波斯尼亚语' },
    { id: 'bg-BG', title: '保加利亚语' },
    // 南亚语言
    { id: 'ur-PK', title: '乌尔都语' },
  ]

  const colors = [
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
  ]

  return (
    <Provider locale={locale} accentColor={accentColor} theme={{}}>
      <h1>基础用法</h1>
      <div className="provider-basic__wrap">
        <Alert title="在 APP 最外层包裹使用，用于主色、国际化、圆角、边框、特效等主题设置"></Alert>
        <Row gutter style={{ marginTop: 20, marginBottom: 20 }}>
          <Col span={8}>
            <Select
              placeholder="选择语言 (30+ 种)"
              data={languageOptions}
              value={locale}
              onChange={(val) => setLocale(val as LocaleEnum)}
            />
          </Col>
          <Col span={8}>
            <Select
              placeholder="配色"
              data={colors}
              value={accentColor}
              onChange={(val) => setAccentColor(val as DesignSystemAccentColorEnum)}
            />
          </Col>
          <Col span={8}>
            <div style={{ padding: '8px 12px', background: '#f5f7fa', borderRadius: '2px' }}>
              当前语言: <strong>{locale || '默认（中文）'}</strong>
            </div>
          </Col>
        </Row>

        {/* DatePicker 组件展示国际化效果 */}
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h3>日期选择器 (国际化演示)</h3>
          <Row gutter>
            <Col span={12}>
              <DatePicker value={date} onChange={setDate} placeholder="选择日期" />
            </Col>
            <Col span={12}>
              <div style={{ padding: '8px 12px', background: '#f0f2f5', borderRadius: '2px' }}>
                {date ? `选择的日期: ${date.toLocaleDateString()}` : '未选择日期'}
              </div>
            </Col>
          </Row>
        </div>

        <Pagination
          total={200}
          pageSize={10}
          showTotal
          showJumper
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </div>
    </Provider>
  )
}
