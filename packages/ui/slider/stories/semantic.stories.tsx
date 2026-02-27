import React, { useState } from 'react'
import { Row, Col } from '@hi-ui/grid'
import List from '@hi-ui/list'
import Slider from '../src'
import type { SliderSemanticName } from '../src'

/**
 * @title 自定义样式
 * @desc 通过 classNames 和 styles 属性，可以对组件进行更细粒度的样式控制
 */
export const Semantic = () => {
  const [selected, setSelected] = useState<SliderSemanticName>()

  return (
    <>
      <h1>Semantic</h1>
      <div className="slider-semantic__wrap">
        <Row gutter={12}>
          <Col span={18}>
            <Slider
              defaultValue={50}
              classNames={{
                root: 'my-slider__root',
                rail: 'my-slider__rail',
                track: 'my-slider__track',
                handle: 'my-slider__handle',
                marks: 'my-slider__marks',
                mark: 'my-slider__mark',
                labels: 'my-slider__labels',
                label: 'my-slider__label',
              }}
              styles={{
                [selected as string]: { outline: '1px solid #ffbe0a' },
              }}
              marks={{
                0: '0°C',
                27: '27°C',
                45: '45°C',
                100: '100°C',
              }}
            />
          </Col>
          <Col span={6}>
            <List
              split={false}
              data={[
                { title: 'root', description: '根元素' },
                { title: 'rail', description: '轨道' },
                { title: 'track', description: '进度条' },
                { title: 'handle', description: '滑块' },
                { title: 'marks', description: '刻度容器' },
                { title: 'mark', description: '刻度点' },
                { title: 'labels', description: '标签容器' },
                { title: 'label', description: '标签' },
              ]}
              render={(dataItem) => (
                <div
                  onMouseEnter={() => setSelected(dataItem.title as SliderSemanticName)}
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
