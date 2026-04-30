import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import DatePicker, { DatePickerSemanticName } from '../src'
import Button from '@hi-ui/button'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 DatePicker 各元素进行细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<DatePickerSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="date-picker-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <DatePicker
              style={{ width: 280 }}
              visible
              showTime
              type="daterange"
              // @ts-ignore
              overlay={{ flip: false }}
              classNames={{
                root: 'my-date-picker__root',
                popper: 'my-date-picker__popper',
                picker: 'my-date-picker__picker',
                pickerWrapper: 'my-date-picker__picker-wrapper',
                inputSelector: 'my-date-picker__input-selector',
                input: 'my-date-picker__input',
                triggerIcon: 'my-date-picker__trigger-icon',
                panel: 'my-date-picker__panel',
                footer: 'my-date-picker__footer',
              }}
              styles={{
                ...(selected
                  ? { [selected]: { outline: '2px solid #ffbe0a', outlineOffset: 2 } }
                  : {}),
              }}
              footerRender={(action, onPick) => {
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <Button type="secondary" appearance="link">
                      今天
                    </Button>
                  </div>
                )
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'inputSelector', description: '输入选区' },
                { title: 'triggerIcon', description: '右侧图标' },
                { title: 'panel', description: '日期面板' },
                { title: 'panelLeft', description: '面板左侧' },
                { title: 'panelHeader', description: '面板头部' },
                { title: 'calendar', description: '日历表格' },
                { title: 'calendarHead', description: '表头(周标题)' },
                { title: 'calendarCell', description: '日历单元格' },
                { title: 'panelTimeContainer', description: '时间容器' },
                { title: 'panelTimeHeader', description: '时间头部' },
                { title: 'panelTimeContent', description: '时间内容' },
                { title: 'footer', description: '页脚' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as DatePickerSemanticName)}
                  onMouseLeave={() => setSelected(undefined)}
                >
                  <List.Item {...dataItem} />
                </div>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  )
}
