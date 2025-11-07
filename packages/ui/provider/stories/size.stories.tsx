import React from 'react'
import Provider from '../src'
import Select from '@hi-ui/select'
import { Row, Col } from '@hi-ui/grid'
import Button from '@hi-ui/button'
import { HiBaseSizeEnum } from '@hi-ui/core'
/**
 * @title 基础用法
 */
export const Size = () => {
  const [size, setSize] = React.useState<HiBaseSizeEnum>()

  return (
    <>
      <h1>基础用法</h1>
      <div className="provider-basic__wrap">
        <Provider size={size}>
          <Row gutter style={{ marginTop: 20, marginBottom: 20 }}>
            <Col span={12}>
              <Select
                placeholder="尺寸"
                overlay={{ placement: 'top' }}
                data={[
                  {
                    id: HiBaseSizeEnum.SM,
                    title: '小',
                  },
                  {
                    id: HiBaseSizeEnum.MD,
                    title: '中',
                  },
                  {
                    id: HiBaseSizeEnum.LG,
                    title: '大',
                  },
                ]}
                value={size}
                onChange={(val) => setSize(val as HiBaseSizeEnum)}
              />
            </Col>
          </Row>
          <Button>按钮</Button>
        </Provider>
      </div>
    </>
  )
}
