import React from 'react'
import Descriptions from '../src'
import Preview from '@hi-ui/preview'
import { JpgColorful } from '@hi-ui/icons'

/**
 * @title 设置标签和内容对齐方式
 */
export const ContentPosition = () => {
  const [images] = React.useState([
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
  ])
  const [visible, setVisible] = React.useState(false)
  const [current, setCurrent] = React.useState(0)

  return (
    <>
      <h1>ContentPosition</h1>
      <div className="descriptions-content-position__wrap">
        <h2>md</h2>
        <Descriptions contentPosition="center" columnGap={24}>
          <Descriptions.Item label="机构类型" labelWidth={84}>
            第三方网点
          </Descriptions.Item>
          <Descriptions.Item label="主子站类型" labelWidth={84}>
            主站
          </Descriptions.Item>
          <Descriptions.Item label="机构状态" labelWidth={84}>
            有效
          </Descriptions.Item>
          <Descriptions.Item label="机构名称" labelWidth={84}>
            某某有限公司
          </Descriptions.Item>
          <Descriptions.Item label="是否自营" labelWidth={84}>
            是
          </Descriptions.Item>
          <Descriptions.Item label="实体门店招牌" labelWidth={84}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <JpgColorful style={{ fontSize: 16 }} />
              <a href="#" style={{ textDecoration: 'none', color: '#4a9eff' }}>
                主站.jpg
              </a>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="备注信息" labelWidth={84}>
            备注内容可能会非常长备注内容可能会非常长备注内容可能会非常长
          </Descriptions.Item>
          <Descriptions.Item label="维度名称常规" labelWidth={84}>
            <img
              src={images[0]}
              style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
              onClick={() => {
                setCurrent(0)
                setVisible(true)
              }}
            />
            <img
              src={images[1]}
              style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer', marginRight: 6 }}
              onClick={() => {
                setCurrent(1)
                setVisible(true)
              }}
            />
            <img
              src={images[2]}
              style={{ width: 40, height: 40, borderRadius: 2, cursor: 'pointer' }}
              onClick={() => {
                setCurrent(2)
                setVisible(true)
              }}
            />
          </Descriptions.Item>
        </Descriptions>

        <Preview
          title={`${current + 1}/${images.length}`}
          src={images}
          current={current}
          onPreviewChange={setCurrent}
          visible={visible}
          onClose={() => {
            setVisible(false)
          }}
        />
      </div>
    </>
  )
}
