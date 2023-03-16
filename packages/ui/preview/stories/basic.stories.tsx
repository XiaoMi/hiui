import React from 'react'
import Preview from '../src'
import Grid from '@hi-ui/grid'

/**
 * @title 基础用法
 */
export const Basic = () => {
  const [showIndex, setShowIndex] = React.useState(-1)
  const [images] = React.useState([
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
  ])

  return (
    <>
      <h1>Basic</h1>
      <div className="preview-basic__wrap">
        <Preview
          title={`pic_${showIndex}.png`}
          src={images[showIndex]}
          visible={showIndex !== -1}
          onClose={() => {
            setShowIndex(-1)
          }}
        />

        <Grid.Row gutter={true}>
          {images.map((url, index) => {
            return (
              <Grid.Col span={4} key={index}>
                <div>
                  <img
                    src={url}
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => {
                      setShowIndex(index)
                    }}
                  />
                </div>
              </Grid.Col>
            )
          })}
        </Grid.Row>
      </div>
    </>
  )
}
