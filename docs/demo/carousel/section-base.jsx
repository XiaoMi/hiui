import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Carousel from '../../../components/carousel'
const prefix = 'carousel-base'
const desc = ''
const code = `import React from 'react'
import Carousel from '@hi-ui/hiui/es/carousel'\n
class Demo extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return (
      <div style={{width: 800}}>
        <Carousel
          defaultActive={2}
        >
          {
            data.map((item,index) => {
              return <div style={{height: 300, textAlign: 'center', lineHeight: '300px', background: '#428ef5', color: '#fff'}} key={index}>{item}</div>
            })
          }
        </Carousel>
      </div>
    )
  }
}`

const DemoBase = () => <DocViewer code={code} scope={{ Carousel }} prefix={prefix} desc={desc} />
export default DemoBase
