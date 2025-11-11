import React from 'react'
import Provider from '../src'
import DatePicker from '@hi-ui/date-picker'
import Modal from '@hi-ui/modal'
import Pagination from '@hi-ui/pagination'
import Upload from '@hi-ui/upload'
import Button from '@hi-ui/button'
import { Row, Col } from '@hi-ui/grid'
import Select from '@hi-ui/select'

/**
 * @title 使用 extends 扩展语言
 * @desc 使用 Provider.extends() 注册完整的自定义语言包
 */
export const Extends = () => {
  const [visible, setVisible] = React.useState(false)
  const [locale, setLocale] = React.useState<string>('zh-CN')

  // 注册自定义"火星语"
  React.useEffect(() => {
    Provider.extends('mars-lang', {
      // @ts-ignore
      timePicker: {
        ok: '🚀确认',
        to: '→',
        now: '⏰现在',
      },
      datePicker: {
        ok: '🚀确认',
        to: '→',
        placeholder: ['🗓️选择火星日期'],
        placeholderTimePeriod: ['⏰选择火星时间'],
        dateChoose: '📅火星日期选择',
        timeChoose: '⏱️火星时间选择',
        undefinedType: '❌类型未定义',
        lastWeek: '近一个火星周',
        lastMonth: '近一个火星月',
        lastThreeMonth: '近三个火星月',
        lastYear: '近一个火星年',
        month: [
          '火一月',
          '火二月',
          '火三月',
          '火四月',
          '火五月',
          '火六月',
          '火七月',
          '火八月',
          '火九月',
          '火十月',
          '火十一月',
          '火十二月',
        ],
        monthShort: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        week: ['日', '一', '二', '三', '四', '五', '六'],
        placeholders: {
          year: ['🗓️选择火星年'],
          quarter: ['📊选择火星季度'],
          month: ['📅选择火星月'],
          week: ['📆选择火星周'],
          date: ['🗓️选择火星日期'],
          time: ['⏰选择火星时间'],
          yearrange: ['🗓️开始年', '🗓️结束年'],
          quarterrange: ['📊开始季度', '📊结束季度'],
          monthrange: ['📅开始月', '📅结束月'],
          weekrange: ['📆开始周', '📆结束周'],
          daterange: ['🗓️开始日期', '🗓️结束日期'],
          timeperiod: ['⏰开始时间', '⏰结束时间'],
          timerange: ['⏰请选择开始时间', '⏰请选择结束时间'],
        },
        year: '年',
        timePeriod: '时间段',
        hours: '时',
        minutes: '分',
        seconds: '秒',
        weekRange: '{{year}}-W{{week}}',
      },
      pagination: {
        total: ['共', '条火星数据'],
        simple: ['第', '页', '共', '页', '条记录'],
        item: '条',
        itemPerPage: '页',
        goto: '前往',
        page: '页',
      },
      modal: {
        confirmText: '🚀确定',
        cancelText: '❌取消',
      },
      upload: {
        buttonText: '🚀上传火星文件',
        uploadSuccess: '✅上传成功',
        cancel: '❌取消',
        delete: '🗑️删除',
        drag: '🚀点击或将文件拖拽至此上传',
        dragTips: '📝请点击或拖拽文件上传',
        dragTipsLimited: '⚠️数量已达上限',
        preview: '👀预览',
        modalTiptitle: '❌上传失败',
        modalTiptxt: '⚠️该上传文件超过指定上传文件大小',
        modalBtn: '✅我知道了',
        modalTitle: '💬提示',
      },
      cascader: {
        placeholder: '🗓️请选择',
        noFoundTip: '❌无匹配数据',
        emptyContent: '📭暂无数据',
      },
      checkCascader: {
        placeholder: '🗓️请选择',
        noFoundTip: '❌无匹配数据',
        emptyContent: '📭暂无数据',
      },
      select: {
        placeholder: '🗓️请选择',
        emptyContent: '❌无匹配数据',
        searchPlaceholder: '🔍搜索',
        checkAll: '✅全选',
        justSelected: '👀仅看已选',
      },
      selectTree: {
        back: '⬅️返回',
        search: '🔍搜索',
        placeholder: '🗓️请选择',
        emptyContent: '❌无匹配数据',
      },
      search: {
        searchEmptyResult: '❌未找到搜索结果',
        searchEmptyRecord: '📝无搜索记录',
        searchRecord: '📜搜索历史',
      },
      transfer: {
        checkAll: '✅全选',
        items: '项',
        searchPlaceholder: '🔍搜索',
        emptyContent: '📭暂无数据',
        limit: '⚠️数量达上限，无法添加',
      },
      tabs: {
        more: '更多',
      },
      timeline: {
        expand: '展开',
        collapse: '收起',
      },
      form: {
        colon: '：',
      },
      tree: {
        addNode: '➕添加节点',
        addChildNode: '➕添加子节点',
        edit: '✏️编辑节点',
        del: '🗑️删除',
        confirm: '🚀确认',
        cancel: '❌取消',
        nodePlaceholder: '📝请输入节点名称',
        searchPlaceholder: '🔍关键词搜索',
        searchEmptyResult: '❌未找到搜索结果',
        modalTitle: '💬提示',
        delTips: '🗑️删除节点将删除所有子节点，确定删除吗？',
      },
      table: {
        emptyContent: '📭暂无数据',
        confirm: '🚀确定',
        reset: '🔄重置',
        ascend: '⬆️升序',
        descend: '⬇️降序',
        highlight: '✨高亮',
        freeze: '❄️冻结',
        total: '💯合计',
        average: '📊平均值',
        fieldExplorer: '🔧字段管理',
      },
      watermark: {
        content: '⚠️请勿外传',
      },
      emptyState: {
        emptyContent: '📭暂无数据',
      },
      checkSelect: {
        placeholder: '🗓️请选择',
        emptyContent: '❌无匹配数据',
        searchPlaceholder: '🔍搜索',
        checkAll: '✅全选',
        justSelected: '👀仅看已选',
      },
      treeSelect: {
        placeholder: '🗓️请选择',
      },
      checkTreeSelect: {
        placeholder: '🗓️请选择',
      },
      picker: {
        placeholder: '🗓️请选择',
        emptyContent: '📭暂无数据',
        noFoundTip: '❌无匹配数据',
        searchPlaceholder: '🔍搜索',
        loadingContent: '⏳数据加载中...',
      },
      zenMode: {
        back: '⬅️返回',
      },
      popConfirm: {
        confirmText: '🚀确定',
        cancelText: '❌取消',
      },
      tag: {
        add: '➕添加',
      },
      backTop: {
        backToTop: '⬆️回到顶部',
      },
    })
  }, [])

  const localeOptions = [
    { id: 'zh-CN', title: '中文' },
    { id: 'mars-lang', title: '火星语' },
  ]

  return (
    <Provider locale={locale as any}>
      <h1>使用 extends 扩展语言</h1>
      <div className="provider-extends__wrap">
        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Select
              placeholder="选择语言"
              data={localeOptions}
              value={locale}
              onChange={(val) => setLocale(val as string)}
            />
          </Col>
          <Col span={12}>
            <div style={{ padding: '8px 12px', background: '#f5f7fa', borderRadius: '2px' }}>
              当前语言: <strong>{locale === 'mars-lang' ? '火星语' : '中文'}</strong>
            </div>
          </Col>
        </Row>

        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <DatePicker />
          </Col>
          <Col span={12}>
            <Upload />
          </Col>
        </Row>

        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Button type="primary" onClick={() => setVisible(true)}>
              打开对话框
            </Button>
            <Modal
              title="火星通知"
              visible={visible}
              onConfirm={() => setVisible(false)}
              onCancel={() => setVisible(false)}
            >
              查看确认和取消按钮的文本
            </Modal>
          </Col>
          <Col span={12}>
            <Pagination total={100} pageSize={10} showTotal />
          </Col>
        </Row>
      </div>
    </Provider>
  )
}

/**
 * @title 使用 merge 创建语言变体
 * @desc 使用 Provider.merge() 基于现有语言创建变体，只需覆盖部分翻译
 */
export const Merge = () => {
  const [visible, setVisible] = React.useState(false)
  const [locale, setLocale] = React.useState<string>('zh-CN')

  // 基于中文创建"儿童版"语言
  React.useEffect(() => {
    Provider.merge('zh-CN', 'zh-CN-child', {
      datePicker: {
        ok: '好啦',
        placeholder: ['选个日期吧'],
        dateChoose: '选日期',
        timeChoose: '选时间',
      },
      pagination: {
        total: ['一共有', '条数据哦'],
        simple: ['第', '页', '共', '页', '条记录'],
        item: '条',
        itemPerPage: '页',
        goto: '跳到',
        page: '页',
      },
      modal: {
        confirmText: '好的',
        cancelText: '不要',
      },
      upload: {
        buttonText: '选择文件',
        tips: '点击或拖拽文件到这里上传',
      },
    })
  }, [])

  const localeOptions = [
    { id: 'zh-CN', title: '中文' },
    { id: 'zh-CN-child', title: '中文（儿童版）' },
  ]

  return (
    <Provider locale={locale as any}>
      <h1>使用 merge 创建语言变体</h1>
      <div className="provider-merge__wrap">
        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Select
              placeholder="选择语言"
              data={localeOptions}
              value={locale}
              onChange={(val) => setLocale(val as string)}
            />
          </Col>
          <Col span={12}>
            <div style={{ padding: '8px 12px', background: '#f5f7fa', borderRadius: '2px' }}>
              当前语言: <strong>{locale === 'zh-CN-child' ? '中文（儿童版）' : '中文'}</strong>
            </div>
          </Col>
        </Row>

        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <DatePicker />
          </Col>
          <Col span={12}>
            <Upload />
          </Col>
        </Row>

        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Button type="primary" onClick={() => setVisible(true)}>
              打开对话框
            </Button>
            <Modal
              title="温馨提示"
              visible={visible}
              onConfirm={() => setVisible(false)}
              onCancel={() => setVisible(false)}
            >
              看看按钮的文字
            </Modal>
          </Col>
          <Col span={12}>
            <Pagination total={50} pageSize={10} showTotal />
          </Col>
        </Row>
      </div>
    </Provider>
  )
}

/**
 * @title 地区语言变体示例
 * @desc 使用 merge 创建地区语言变体，如英式英语
 */
export const RegionalVariant = () => {
  const [visible, setVisible] = React.useState(false)
  const [locale, setLocale] = React.useState<string>('en-US')

  // 基于美式英语创建英式英语
  React.useEffect(() => {
    Provider.merge('en-US', 'en-GB', {
      datePicker: {
        ok: 'Confirm',
        placeholder: ['Select date'],
      },
      pagination: {
        total: ['Total', 'items'],
      },
      modal: {
        confirmText: 'Confirm',
        cancelText: 'Cancel',
      },
    })
  }, [])

  const localeOptions = [
    { id: 'en-US', title: 'English (US)' },
    { id: 'en-GB', title: 'English (UK)' },
  ]

  return (
    <Provider locale={locale as any}>
      <h1>Regional Language Variant</h1>
      <div className="provider-regional__wrap">
        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <Select
              placeholder="Select language"
              data={localeOptions}
              value={locale}
              onChange={(val) => setLocale(val as string)}
            />
          </Col>
          <Col span={12}>
            <div style={{ padding: '8px 12px', background: '#f5f7fa', borderRadius: '2px' }}>
              Current: <strong>{locale === 'en-GB' ? 'English (UK)' : 'English (US)'}</strong>
            </div>
          </Col>
        </Row>

        <Row gutter style={{ marginBottom: 20 }}>
          <Col span={12}>
            <DatePicker />
          </Col>
          <Col span={12}>
            <Pagination total={100} pageSize={10} showTotal />
          </Col>
        </Row>

        <Row gutter>
          <Col span={12}>
            <Button type="primary" onClick={() => setVisible(true)}>
              Open Modal
            </Button>
            <Modal
              title="Notification"
              visible={visible}
              onConfirm={() => setVisible(false)}
              onCancel={() => setVisible(false)}
            >
              Check the button text
            </Modal>
          </Col>
        </Row>
      </div>
    </Provider>
  )
}
