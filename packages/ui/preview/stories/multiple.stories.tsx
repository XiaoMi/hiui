import React from 'react'
import Preview from '../src'
import Grid from '@hi-ui/grid'

/**
 * @title 多图预览
 */
export const Multiple = () => {
  const [images] = React.useState([
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
    'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
  ])
  const [visible, setVisible] = React.useState(false)
  const [current, setCurrent] = React.useState(0)

  return (
    <>
      <h1>Multiple</h1>
      <div className="preview-multiple__wrap">
        <Preview
          src={images}
          current={current}
          onPreviewChange={setCurrent}
          visible={visible}
          onClose={() => {
            setVisible(false)
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
                      setCurrent(index)
                      setVisible(true)
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
