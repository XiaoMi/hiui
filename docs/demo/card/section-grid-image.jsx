import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Card from '../../../components/card'
import Grid from '../../../components/grid'
const prefix = 'card-grid-image'
const desc = '结合 Grid 布局的各种卡片类型'
const rightOptions = ['图片式', '迷你式', '其他样式']
const code = [
  {
    code: `import React from 'react'
import Grid from '@hi-ui/hiui/es/grid'
import Card from '@hi-ui/hiui/es/card'\n
class Demo extends React.Component {
  render() {
    const {Row, Col} = Grid
    return (
      <React.Fragment>
         <Row gutter={true}>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_8.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_7.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_6.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_5.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
        </Row>
        <Row gutter={true}>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_4.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_3.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_2.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              coverUrl='http://i1.mifile.cn/f/i/hiui/docs/card/pic_1.png'
              title='图片展示'
              content='这是图片描述'
            ></Card>
          </Col>
        </Row>
      </React.Fragment>
    )
  }
}`,
    opt: ['图片式']
  },
  {
    code: `import React from 'react'
    import Grid from '@hi-ui/hiui/es/grid'
    import Card from '@hi-ui/hiui/es/card'\n
    class Demo extends React.Component {
      render() {
        const {Row, Col} = Grid
        return (
          <React.Fragment>
            <Row gutter={true}>
              <Col span={4}>
                <Card
                  hoverable
                  type='simple'
                >
                  简易卡片
                </Card>
              </Col>
              <Col span={4}>
                <Card
                  hoverable
                  type='simple'
                >
                  简易卡片
                </Card>
              </Col>
              <Col span={4}>
                <Card
                  hoverable
                  type='simple'
                >
                  简易卡片
                </Card>
              </Col>
              <Col span={4}>
                <Card
                  hoverable
                  type='simple'
                >
                  简易卡片
                </Card>
              </Col>
              <Col span={4}>
                <Card
                  hoverable
                  type='simple'
                >
                  简易卡片
                </Card>
              </Col>
              <Col span={4}>
                <Card
                  hoverable
                  type='simple'
                >
                  简易卡片
                </Card>
              </Col>
            </Row>
          </React.Fragment>
        )
      }
    }`,
    opt: ['迷你式']
  },
  {
    code: `import React from 'react'
  import Grid from '@hi-ui/hiui/es/grid'
  import Card from '@hi-ui/hiui/es/card'\n
  class Demo extends React.Component {
    render() {
      const {Row, Col} = Grid
      const colors = ['#46bc99', '#37d5fa', '#b450de', '#fadb14']
      const cols = colors.map((color, index) => {
        return (
          <Col span={6} key={index}>
            <Card hoverable style={{borderLeft: \`2px solid \${color}\`,}}>
              <p>无标题</p>
              <p>鼠标移入悬浮效果</p>
              <p>其它额外内容</p>
            </Card>
          </Col>
        )
      })
      return (
        <React.Fragment>
          <Row gutter={true}>
            {cols}
          </Row>
        </React.Fragment>
      )
    }
  }`,
    opt: ['其他样式']
  }
]

const DemoGridImage = () => (
  <DocViewer
    code={code}
    scope={{ Card, Grid }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoGridImage
