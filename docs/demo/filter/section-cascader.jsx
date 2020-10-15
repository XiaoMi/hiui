import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Filter from '../../../components/filter'
const prefix = 'filter-cascader'
const desc = '一般作为筛选场景，作为筛选项组合,每个级别之间有联动'
const code = `import React from 'react'
import Filter from '@hi-ui/hiui/es/filer'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value:[2, 21, '小米MIXS'],
      data:  [
        {
          id: 1,
          content: '小米商城',
          children: [
            {
              id: 11,
              content: '小米商城'
            },
            {
              id: 12,
              content: '米家优品',
              disabled: true
            }
          ]
        },
        {
          id: 2,
          content: '米家有品',
          children: [
            {
              id: 21,
              content: '五彩城店',
              children: [
                {
                  id: '小米9',
                  content: '小米9'
                },
                {
                  id: '小米MIXS',
                  content: '小米MIXS'
                },
                {
                  id: '小米8',
                  content: '小米8'
                },
              ]
            },
            {
              id: 22,
              content: '清河店'
            },
            {
              id: 23,
              content: '西三旗店'
            }
          ]
        },

        {
          id: 3,
          content: '京东商城',
          children: [
            {
              id: 31,
              content: '小米直营',
              children: [
                {
                  id: '线下KA',
                  content: '线下KA'
                }
              ]
            }
          ]
        }
      ]
    }
  }
  render () {
    const {data,value} = this.state
    return (
      <div>
        <Filter
        label = {['渠道', '分店', '机型']}
        labelWidth = '80'
        showUnderline = {true}
        value= {value}
        data={data}
        onChange={value => {
          console.log('value', value)
          this.setState({
            value:value
          })
        }}
      />
    </div>
    )
  }
}`

const DemoBase = () => <DocViewer desc={desc} code={code} scope={{ Filter }} prefix={prefix} />
export default DemoBase
