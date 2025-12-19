import React from 'react'
import Preview from '../src'
import Grid from '@hi-ui/grid'

/**
 * @title 图片标题
 * @desc 默认使用图片的文件名作为标题，可以通过 <code>title</code> 属性自定义标题
 */
export const Title = () => {
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
      <h1>Title</h1>
      <div className="preview-title__wrap">
        <Preview
          src={images}
          title={(url, index) => {
            return `title_${index}`
          }}
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
