import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-advanced'
const desc = '展示从多个收起的备选项中选出的一个选项'
const rightOptions = ['自定义字段名', '自定义显示', '动态加载选项', 'hover触发次级菜单', '选中任意层级']
const code = [
  {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          goodsId: '手机',
          goodsName: '手机',
          subGoods: [
            {
              goodsId: '小米',
              goodsName: '小米',
              subGoods: [
                {
                  goodsId: '小米3',
                  goodsName: '小米3'
                },
                {
                  goodsId: '小米4',
                  goodsName: '小米4'
                },
              ]
            },
            {
              goodsId: '红米',
              goodsName: '红米',
              subGoods: [
                {
                  goodsId: '红米3',
                  goodsName: '红米3'
                },
                {
                  goodsId: '红米4',
                  goodsName: '红米4'
                }
              ]
            }
          ]
        },
        {
          goodsId: '电视',
          goodsName: '电视',
          subGoods: [
            {
              goodsId: '小米电视4A',
              goodsName: '小米电视4A'
            },
            {
              goodsId: '小米电视4C',
              goodsName: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(value)=>{
          console.log('on change', value)
        }}
        fieldNames={{
          label: 'goodsName',
          value: 'goodsId',
          children: 'subGoods',
        }}
        data={this.state.options}
        style={{width: '240px'}}
      />
    )
  }
}`,
    opt: ['自定义字段名']
  },
  {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(value)=>{
          console.log('on change', value)
        }}
        data={this.state.options}
        style={{ width: 240 }}
        displayRender={values => {
          return values.join(' > ')
        }}
      />
    )
  }
}`,
    opt: ['自定义显示']
  },
  {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: []
    }
  }
  render(){
    return(
      <Cascader
        onChange={(value)=>{
          console.log('on change', value)
        }}
        data={this.state.options}
        style={{ width: 240 }}
        onOpen={()=>{
          const {options} = this.state
          if(options.length === 0){
            setTimeout(()=>{
              this.setState({
                options: [
                  {
                    id: '手机',
                    content: '手机',
                    children: [
                      {
                        id: '手机2',
                        content: '手机2',
                      }
                    ]
                  },
                  {
                    id: '平板',
                    content: '平板'
                  },
                  {
                    id: 'mix',
                    content: 'Mix',
                    children: []
                  }
                ]
              })
            }, 2000)
          }
        }}
        onActiveItemChange={values=>{
          if(values[0] == 'mix') {
            setTimeout(()=>{
              const _options = this.state.options
              _options[2].children = [
                {
                  id: 'mix1',
                  content: 'Mix1'
                },{
                  id: 'mix2',
                  content: 'Mix2'
                },{
                  id: 'mix3',
                  content: 'Mix3'
                }
              ]
              this.setState({
                options: _options
              })
            }, 1000)
          }
        }}
      />
    )
  }
}`,
    opt: ['动态加载选项']
  },
  {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(id)=>{
          console.log('on change', id)
        }}
        expandTrigger='hover'
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['hover触发次级菜单']
  },
  {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
        {
          id: '手机',
          content: '手机',
          children: [
            {
              id: '小米',
              content: '小米',
              children: [
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米3',
                  content: '红米3'
                },
                {
                  id: '红米4',
                  content: '红米4'
                }
              ]
            }
          ]
        },
        {
          id: '电视',
          content: '电视',
          children: [
            {
              id: '小米电视4A',
              content: '小米电视4A'
            },
            {
              id: '小米电视4C',
              content: '小米电视4C'
            }
          ]
        }
      ]
    }
  }
  render(){
    return(
      <Cascader
        onChange={(id)=>{
          console.log('on change', id)
        }}
        changeOnSelect
        expandTrigger='hover'
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['选中任意层级']
  }
]

const DemoBasic = () => (
  <DocViewer code={code} scope={{ Cascader }} prefix={prefix} desc={desc} rightOptions={rightOptions} />
)
export default DemoBasic
