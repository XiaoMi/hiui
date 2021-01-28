import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Preview from '../../../components/preview/index.js'
import Grid from '../../../components/grid'
const prefix = 'Preview-base'
const desc = '用于大图预览'
const code = `import React from 'react'
import Button from '@hi-ui/hiui/es/button'
import Preview from '@hi-ui/hiui/es/preview'\n
import Grid from '@hi-ui/hiui/es/grid'\n
class Demo extends React.Component {
  constructor() {
    super()
    this.state = {
      previewShow: false,
      activeIndex: 0,
      images: [
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_8.png',
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_7.png',
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_6.png',
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_5.png',
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png',
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png',
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png',
        'http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png',
      ]
    }
  }
  render() {
    const { images, previewShow, activeIndex } = this.state
    const Row = Grid.Row
    const Col = Grid.Col
    return (
      <div>
        <Row gutter={true}>
          {
            this.state.images.slice(0, 4).map((url, index) => {
              return <Col span={4} key={index}>
                <img src={url} style={{width: '100%', cursor: 'pointer'}} onClick={() => this.setState({previewShow: true,activeIndex: index })}/>
              </Col>
            })
          }
        </Row>
        <Preview
          images={images}
          simpleData={true}
          visible={previewShow}
          showArrow={true}
          activeIndex={activeIndex}
          showCount={true}
          onClose={() => this.setState({previewShow: false})}
        />
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Preview, Grid }} prefix={prefix} desc={desc} />
export default DemoBase
