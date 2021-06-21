import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Filter from '../../../components/filter'
const prefix = 'filter-base'
const desc = '一般作为筛选场景，作为筛选项'
const rightOptions = ['基础', '禁用', '受控']

const code = [
  {
    code: `import React from 'react'
    import Filter from '@hi-ui/hiui/es/filter'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          dataStore: [
            {
              id:1,
              content: '小米商城'
            },
            {
              id:2,
              content: '米家有品'
            },
            {
              id:3,
              content: '京东商城'
            },
            {
              id:4,
              content: '天猫淘宝'
            },
            {
              id:5,
              content: '创新渠道'
            },
            {
              id:6,
              content: '线下KA'
            },
            {
              id:7,
              content: '线下KA1'
            },
            {
              id:8,
              content: '线下KA2'
            },
            {
              id:9,
              content: '线下KA3'
            },
            {
              id:10,
              content: '线下KA4'
            }
          ],
          dataColor: [
            {
              id:1,
              content: '深空'
            },
            {
              id:2,
              content: '白色'
            },
            {
              id:3,
              content: '亮黑色'
            },
            {
              id:4,
              content: '金色'
            },
          ]
        }
      }
      render () {
        const {dataStore,dataColor} = this.state
        return (
          <div>
            <Filter
            label={['渠道']}
            defaultValue={[1]}
            data={dataStore}
            onChange={value => {
              console.log('value', value)
            }}
          />
          <Filter
            label={['颜色']}
            defaultValue={[1]}
            data={dataColor}
            onChange={value => {
              console.log('value', value)
            }}
          />
        </div>
        )
      }
    }`,
    opt: ['基础']
  },
  {
    code: `import React from 'react'
    import Filter from '@hi-ui/hiui/es/filter'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          dataStore: [
            {
              id:1,
              content: '小米商城'
            },
            {
              id:2,
              content: '米家有品'
            },
            {
              id:3,
              content: '京东商城',
              disabled:true
            },
            {
              id:4,
              content: '天猫淘宝'
            },
            {
              id:5,
              content: '创新渠道'
            },
            {
              id:6,
              content: '线下KA'
            },
            {
              id:7,
              content: '线下KA1'
            },
            {
              id:8,
              content: '线下KA2'
            },
            {
              id:9,
              content: '线下KA3'
            },
            {
              id:10,
              content: '线下KA4'
            }
          ],
          dataColor: [
            {
              id:1,
              content: '深空'
            },
            {
              id:2,
              content: '白色'
            },
            {
              id:3,
              content: '亮黑色'
            },
            {
              id:4,
              content: '金色'
            },
          ]
        }
      }
      render () {
        const {dataStore,dataColor} = this.state
        return (
          <div>
            <Filter
            label={['渠道']}
            defaultValue={[1]}
            data={dataStore}
            onChange={value => {
              console.log('value', value)
            }}
          />
          <Filter
            label={['颜色']}
            defaultValue={[1]}
            data={dataColor}
            onChange={value => {
              console.log('value', value)
            }}
          />
        </div>
        )
      }
    }`,
    opt: ['禁用']
  },
  {
    code: `import React from 'react'
    import Filter from '@hi-ui/hiui/es/filter'\n
    class Demo extends React.Component {
      constructor(props) {
        super(props)
        this.state = {
          storeActiveId:[1],
          colorActiveId:[2],
          dataStore: [
            {
              id:1,
              content: '小米商城'
            },
            {
              id:2,
              content: '米家有品'
            },
            {
              id:3,
              content: '京东商城',
              disable:true
            },
            {
              id:4,
              content: '天猫淘宝'
            },
            {
              id:5,
              content: '创新渠道'
            },
            {
              id:6,
              content: '线下KA'
            },
            {
              id:7,
              content: '线下KA1'
            },
            {
              id:8,
              content: '线下KA2'
            },
            {
              id:9,
              content: '线下KA3'
            },
            {
              id:10,
              content: '线下KA4'
            }
          ],
          dataColor: [
            {
              id:1,
              content: '深空'
            },
            {
              id:2,
              content: '白色'
            },
            {
              id:3,
              content: '亮黑色'
            },
            {
              id:4,
              content: '金色'
            },
          ]
        }
      }
      render () {
        const {dataStore,dataColor,storeActiveId,colorActiveId} = this.state
        return (
          <div>
            <Filter
            label={['渠道']}
            value={storeActiveId}
            data={dataStore}
            onChange={value => {
              console.log('value', value)
              this.setState({
                storeActiveId: value
              })
            }}
          />
          <Filter
            label={['颜色']}
            value={colorActiveId}
            data={dataColor}
            onChange={value => {
              console.log('value', value)
              this.setState({
                colorActiveId: value
              })
            }}
          />
        </div>
        )
      }
    }`,
    opt: ['受控']
  }
]

const DemoBase = () => (
  <DocViewer desc={desc} code={code} scope={{ Filter }} prefix={prefix} rightOptions={rightOptions} />
)
export default DemoBase
