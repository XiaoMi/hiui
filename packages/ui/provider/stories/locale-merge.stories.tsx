import React from 'react'
import Provider from '../src'
import DatePicker from '@hi-ui/date-picker'
import Modal from '@hi-ui/modal'
import Pagination from '@hi-ui/pagination'
import Button from '@hi-ui/button'
import Select from '@hi-ui/select'

/**
 * @title 创建语言变体
 * @desc 使用 Provider.merge() 基于现有语言创建变体，只需覆盖部分翻译
 */
export const LocaleMerge = () => {
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
    })
  }, [])

  const localeOptions = [
    { id: 'zh-CN', title: '中文' },
    { id: 'zh-CN-child', title: '中文（儿童版）' },
  ]

  return (
    <>
      <h1>使用 merge 创建语言变体</h1>
      <div className="provider-merge__wrap">
        <Provider locale={locale as any}>
          <Select
            style={{ width: 240 }}
            placeholder="Select language"
            data={localeOptions}
            value={locale}
            onChange={(val) => setLocale(val as string)}
          />

          <DatePicker style={{ width: 240, margin: '24px 0' }} />
          <Pagination total={100} pageSize={10} showTotal style={{ margin: '24px 0' }} />
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
        </Provider>
      </div>
    </>
  )
}
