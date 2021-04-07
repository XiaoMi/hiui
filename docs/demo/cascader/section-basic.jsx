import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-basic'
const desc = '展示从多个收起的备选项中选出的一个选项'
const rightOptions = ['基础', '带默认值', '可清空', '禁用']
const code = [
  {
    code: `import React from 'react'
    import Cascader from '@hi-ui/hiui/es/cascader'
    
    class Demo extends React.Component {
      constructor () {
        super()
        this.state = {
          options: [
          {
            "id": 459,
            "categoryType": "CONSUMABLE_MATERIALS",
            "status": 1,
            "path": "0-459",
            "children": [
              {
                "id": 463,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-463",
                "children": [
                  {
                    "id": 497,
                    "categoryType": "CONSUMABLE_MATERIALS",
                    "status": 1,
                    "path": "0-459-463-497",
                    "children": null,
                    "treeNodeIds": [
                      497
                    ],
                    "title": "胶水[459-463-497]"
                  },
                  {
                    "id": 470,
                    "categoryType": "CONSUMABLE_MATERIALS",
                    "status": 1,
                    "path": "0-459-463-470",
                    "children": null,
                    "treeNodeIds": [
                      470
                    ],
                    "title": "锡膏[459-463-470]"
                  }
                ],
                "treeNodeIds": [
                  497,
                  470,
                  463
                ],
                "title": "辅料耗材[459-463]"
              },
              {
                "id": 464,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-464",
                "children": null,
                "treeNodeIds": [
                  464
                ],
                "title": "包装运输[459-464]"
              },
              {
                "id": 462,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-462",
                "children": [
                  {
                    "id": 472,
                    "categoryType": "CONSUMABLE_MATERIALS",
                    "status": 1,
                    "path": "0-459-462-472",
                    "children": null,
                    "treeNodeIds": [
                      472
                    ],
                    "title": "刮刀[459-462-472]"
                  },
                  {
                    "id": 471,
                    "categoryType": "CONSUMABLE_MATERIALS",
                    "status": 1,
                    "path": "0-459-462-471",
                    "children": null,
                    "treeNodeIds": [
                      471
                    ],
                    "title": "钢网[459-462-471]"
                  }
                ],
                "treeNodeIds": [
                  471,
                  472,
                  462
                ],
                "title": "工装夹具[459-462]"
              },
              {
                "id": 465,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-465",
                "children": null,
                "treeNodeIds": [
                  465
                ],
                "title": "工具配件[459-465]"
              },
              {
                "id": 466,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-466",
                "children": null,
                "treeNodeIds": [
                  466
                ],
                "title": "设备设施[459-466]"
              },
              {
                "id": 467,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-467",
                "children": null,
                "treeNodeIds": [
                  467
                ],
                "title": "劳保防护[459-467]"
              },
              {
                "id": 496,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-496",
                "children": null,
                "treeNodeIds": [
                  496
                ],
                "title": "办公用品[459-496]"
              },
              {
                "id": 468,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-468",
                "children": null,
                "treeNodeIds": [
                  468
                ],
                "title": "环境清洁[459-468]"
              },
              {
                "id": 469,
                "categoryType": "CONSUMABLE_MATERIALS",
                "status": 1,
                "path": "0-459-469",
                "children": null,
                "treeNodeIds": [
                  469
                ],
                "title": "其它[459-469]"
              }
            ],
            "treeNodeIds": [
              459,
              462,
              463,
              464,
              496,
              497,
              465,
              466,
              467,
              468,
              469,
              470,
              471,
              472
            ],
            "title": "全部辅耗材[459]"
          },
          {
            "id": 458,
            "categoryType": "CONSUMABLE_MATERIALS",
            "status": 1,
            "path": "0-458",
            "children": null,
            "treeNodeIds": [
              458
            ],
            "title": "未分类辅耗材[458]"
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
            fieldNames={{
              label: 'title',
    //          value: 'path',
            }}
            value={[]}
            data={this.state.options}
            style={{ width: 240 }}
          />
        )
      }
    }`,
    opt: ['基础']
  }, {
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
        value={['电视','小米电视4C']}
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['带默认值']
  }, {
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
        data={this.state.options}
        style={{ width: 240 }}
        clearable
      />
    )
  }
}`,
    opt: ['可清空']
  }, {
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
        disabled
        onChange={(id)=>{
          console.log('on change', id)
        }}
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['禁用']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Cascader }}
    prefix={prefix}
    desc={desc}
    rightOptions={rightOptions}
  />
)
export default DemoBasic
