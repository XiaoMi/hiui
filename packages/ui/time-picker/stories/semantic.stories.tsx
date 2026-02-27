import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import TimePicker, { TimePickerSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对 TimePicker 各元素进行细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<TimePickerSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="time-picker-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <TimePicker
              style={{ width: 280 }}
              placeholder={['请选择时间']}
              classNames={{
                root: 'my-time-picker__root',
                inputWrapper: 'my-time-picker__input-wrapper',
                prefix: 'my-time-picker__prefix',
                label: 'my-time-picker__label',
                input: 'my-time-picker__input',
                functionButton: 'my-time-picker__function-button',
                closeButton: 'my-time-picker__close-button',
                popContent: 'my-time-picker__pop-content',
                popFunctionButtons: 'my-time-picker__pop-function-buttons',
                popConfirmBtn: 'my-time-picker__pop-confirm-btn',
                popNowBtn: 'my-time-picker__pop-now-btn',
              }}
              styles={{
                ...(selected
                  ? { [selected]: { outline: '2px solid #ffbe0a', outlineOffset: 2 } }
                  : {}),
              }}
              // @ts-ignore
              overlay={{ flip: false }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'input', description: '输入框' },
                { title: 'functionButton', description: '右侧功能按钮区域' },
                { title: 'closeButton', description: '关闭/清空按钮' },
                { title: 'popContent', description: '弹层时间选择内容' },
                { title: 'popFunctionButtons', description: '弹层底部按钮区域' },
                { title: 'popConfirmBtn', description: '确认按钮' },
                { title: 'popNowBtn', description: '此刻按钮' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as TimePickerSemanticName)}
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
