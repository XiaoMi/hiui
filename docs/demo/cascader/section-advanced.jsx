import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Cascader from '../../../components/cascader'
const prefix = 'section-advanced'
const rightOptions = ['自定义字段名', '自定义显示', '搜索', '动态加载选项']
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
  }, {
    code: `import React from 'react'
import Cascader from '@hi-ui/hiui/es/cascader'\n
class Demo extends React.Component {
  constructor () {
    super()
    this.state = {
      options: [
    {
        "id":1,

        "children":[
            {
                "id":195,

                "children":[
                    {
                        "id":619,

                        "children":[
                            {
                                "id":621,

                                "children":[
                                    {
                                        "id":899,

                                        "children":null,
                                        "content":"testaaab[899]"
                                    },
                                    {
                                        "id":908,

                                        "children":null,
                                        "content":"F11S[908]"
                                    }
                                ],
                                "content":"POCO手机1[621]"
                            }
                        ],
                        "content":"POCO手机[619]"
                    },
                    {
                        "id":577,

                        "children":[
                            {
                                "id":579,

                                "children":null,
                                "content":"黑鲨手机1[579]"
                            },
                            {
                                "id":656,

                                "children":null,
                                "content":"黑鲨手机 Helo[656]"
                            }
                        ],
                        "content":"黑鲨手机[577]"
                    },
                    {
                        "id":196,

                        "children":[
                            {
                                "id":663,

                                "children":null,
                                "content":"小米Play[663]"
                            },
                            {
                                "id":197,

                                "children":[
                                    {
                                        "id":651,

                                        "children":null,
                                        "content":"小米Mix3[651]"
                                    },
                                    {
                                        "id":519,

                                        "children":null,
                                        "content":"小米Mix2[519]"
                                    },
                                    {
                                        "id":198,

                                        "children":null,
                                        "content":"小米Mix1[198]"
                                    },
                                    {
                                        "id":565,

                                        "children":null,
                                        "content":"小米Mix2S[565]"
                                    }
                                ],
                                "content":"小米Mix[197]"
                            },
                            {
                                "id":199,

                                "children":[
                                    {
                                        "id":520,

                                        "children":null,
                                        "content":"小米Note 3[520]"
                                    },
                                    {
                                        "id":200,

                                        "children":null,
                                        "content":"小米Note2[200]"
                                    },
                                    {
                                        "id":235,

                                        "children":null,
                                        "content":"小米Note1[235]"
                                    }
                                ],
                                "content":"小米Note[199]"
                            },
                            {
                                "id":201,

                                "children":[
                                    {
                                        "id":879,

                                        "children":null,
                                        "content":"F3B[879]"
                                    },
                                    {
                                        "id":874,

                                        "children":null,
                                        "content":"F9S[874]"
                                    },
                                    {
                                        "id":851,

                                        "children":null,
                                        "content":"小米9 SE[851]"
                                    },
                                    {
                                        "id":850,

                                        "children":null,
                                        "content":"小米9 透明版[850]"
                                    },
                                    {
                                        "id":849,

                                        "children":null,
                                        "content":"小米9[849]"
                                    },
                                    {
                                        "id":644,

                                        "children":null,
                                        "content":"小米8 屏幕指纹版[644]"
                                    },
                                    {
                                        "id":636,

                                        "children":null,
                                        "content":"小米8 青春[636]"
                                    },
                                    {
                                        "id":603,

                                        "children":null,
                                        "content":"小米8 SE[603]"
                                    },
                                    {
                                        "id":848,

                                        "children":null,
                                        "content":"小米 9 海外[848]"
                                    },
                                    {
                                        "id":602,

                                        "children":null,
                                        "content":"小米8[602]"
                                    },
                                    {
                                        "id":202,

                                        "children":null,
                                        "content":"小米6[202]"
                                    },
                                    {
                                        "id":203,

                                        "children":null,
                                        "content":"小米5s Plus[203]"
                                    },
                                    {
                                        "id":204,

                                        "children":null,
                                        "content":"小米5s[204]"
                                    },
                                    {
                                        "id":205,

                                        "children":null,
                                        "content":"小米5C[205]"
                                    },
                                    {
                                        "id":206,

                                        "children":null,
                                        "content":"小米5[206]"
                                    },
                                    {
                                        "id":222,

                                        "children":null,
                                        "content":"小米1[222]"
                                    },
                                    {
                                        "id":223,

                                        "children":null,
                                        "content":"小米1S[223]"
                                    },
                                    {
                                        "id":224,

                                        "children":null,
                                        "content":"小米2[224]"
                                    },
                                    {
                                        "id":225,

                                        "children":null,
                                        "content":"小米2S[225]"
                                    },
                                    {
                                        "id":226,

                                        "children":null,
                                        "content":"小米2A[226]"
                                    },
                                    {
                                        "id":227,

                                        "children":null,
                                        "content":"小米3[227]"
                                    },
                                    {
                                        "id":233,

                                        "children":null,
                                        "content":"小米4[233]"
                                    },
                                    {
                                        "id":238,

                                        "children":null,
                                        "content":"小米4C[238]"
                                    },
                                    {
                                        "id":239,

                                        "children":null,
                                        "content":"小米4S[239]"
                                    },
                                    {
                                        "id":240,

                                        "children":null,
                                        "content":"小米4i[240]"
                                    },
                                    {
                                        "id":514,

                                        "children":null,
                                        "content":"小米5X[514]"
                                    },
                                    {
                                        "id":584,

                                        "children":null,
                                        "content":"小米6X[584]"
                                    }
                                ],
                                "content":"小米手机[201]"
                            },
                            {
                                "id":207,

                                "children":[
                                    {
                                        "id":620,

                                        "children":null,
                                        "content":"小米Max3[620]"
                                    },
                                    {
                                        "id":208,

                                        "children":null,
                                        "content":"小米Max1[208]"
                                    },
                                    {
                                        "id":241,

                                        "children":null,
                                        "content":"小米Max2[241]"
                                    }
                                ],
                                "content":"小米Max[207]"
                            }
                        ],
                        "content":"小米系列[196]"
                    },
                    {
                        "id":209,

                        "children":[
                            {
                                "id":876,

                                "children":[
                                    {
                                        "id":868,

                                        "children":null,
                                        "content":"Redmi K20 Pro[868]"
                                    },
                                    {
                                        "id":867,

                                        "children":null,
                                        "content":"Redmi K20[867]"
                                    }
                                ],
                                "content":"Redmi K系列[876]"
                            },
                            {
                                "id":862,

                                "children":[
                                    {
                                        "id":838,

                                        "children":null,
                                        "content":"红米GO 1[838]"
                                    }
                                ],
                                "content":"红米GO[862]"
                            },
                            {
                                "id":210,

                                "children":[
                                    {
                                        "id":211,

                                        "children":null,
                                        "content":"红米Pro 1[211]"
                                    }
                                ],
                                "content":"红米Pro[210]"
                            },
                            {
                                "id":212,

                                "children":[
                                    {
                                        "id":875,

                                        "children":null,
                                        "content":"Redmi Note 7S[875]"
                                    },
                                    {
                                        "id":846,

                                        "children":null,
                                        "content":"Redmi Note 7 Pro[846]"
                                    },
                                    {
                                        "id":675,

                                        "children":null,
                                        "content":"Redmi Note 7[675]"
                                    },
                                    {
                                        "id":213,

                                        "children":null,
                                        "content":"红米Note4X[213]"
                                    },
                                    {
                                        "id":214,

                                        "children":null,
                                        "content":"红米Note4[214]"
                                    },
                                    {
                                        "id":215,

                                        "children":null,
                                        "content":"红米Note3[215]"
                                    },
                                    {
                                        "id":230,

                                        "children":null,
                                        "content":"红米Note1[230]"
                                    },
                                    {
                                        "id":237,

                                        "children":null,
                                        "content":"红米Note2[237]"
                                    },
                                    {
                                        "id":515,

                                        "children":null,
                                        "content":"红米Note5A[515]"
                                    },
                                    {
                                        "id":560,

                                        "children":null,
                                        "content":"红米Note5[560]"
                                    },
                                    {
                                        "id":573,

                                        "children":null,
                                        "content":"E6[573]"
                                    },
                                    {
                                        "id":628,

                                        "children":null,
                                        "content":"E7T[628]"
                                    }
                                ],
                                "content":"红米Note[212]"
                            },
                            {
                                "id":216,

                                "children":[
                                    {
                                        "id":871,

                                        "children":null,
                                        "content":"Redmi 7A[871]"
                                    },
                                    {
                                        "id":859,

                                        "children":null,
                                        "content":"红米 Y3[859]"
                                    },
                                    {
                                        "id":854,

                                        "children":null,
                                        "content":"红米 7[854]"
                                    },
                                    {
                                        "id":612,

                                        "children":null,
                                        "content":"红米6Pro[612]"
                                    },
                                    {
                                        "id":605,

                                        "children":null,
                                        "content":"红米6[605]"
                                    },
                                    {
                                        "id":604,

                                        "children":null,
                                        "content":"红米6A[604]"
                                    },
                                    {
                                        "id":525,

                                        "children":null,
                                        "content":"红米5A[525]"
                                    },
                                    {
                                        "id":217,

                                        "children":null,
                                        "content":"红米4X[217]"
                                    },
                                    {
                                        "id":218,

                                        "children":null,
                                        "content":"红米4[218]"
                                    },
                                    {
                                        "id":219,

                                        "children":null,
                                        "content":"红米4A[219]"
                                    },
                                    {
                                        "id":220,

                                        "children":null,
                                        "content":"红米3X[220]"
                                    },
                                    {
                                        "id":221,

                                        "children":null,
                                        "content":"红米3S[221]"
                                    },
                                    {
                                        "id":228,

                                        "children":null,
                                        "content":"红米1[228]"
                                    },
                                    {
                                        "id":229,

                                        "children":null,
                                        "content":"红米1S[229]"
                                    },
                                    {
                                        "id":231,

                                        "children":null,
                                        "content":"红米3[231]"
                                    },
                                    {
                                        "id":232,

                                        "children":null,
                                        "content":"红米2S[232]"
                                    },
                                    {
                                        "id":234,

                                        "children":null,
                                        "content":"红米2[234]"
                                    },
                                    {
                                        "id":236,

                                        "children":null,
                                        "content":"红米2A[236]"
                                    },
                                    {
                                        "id":539,

                                        "children":null,
                                        "content":"红米5[539]"
                                    },
                                    {
                                        "id":540,

                                        "children":null,
                                        "content":"红米5 Plus[540]"
                                    },
                                    {
                                        "id":909,

                                        "children":null,
                                        "content":"Redmi 8A[909]"
                                    }
                                ],
                                "content":"红米手机[216]"
                            }
                        ],
                        "content":"红米系列[209]"
                    },
                    {
                        "id":925,

                        "children":[
                            {
                                "id":926,

                                "children":null,
                                "content":"大象手机A[926]"
                            },
                            {
                                "id":927,

                                "children":null,
                                "content":"大象手机B[927]"
                            }
                        ],
                        "content":"大象手机[925]"
                    }
                ],
                "content":"手机[195]"
            },
            {
                "id":674,

                "children":[
                    {
                        "id":872,

                        "children":null,
                        "content":"翻译机(废弃)[872]"
                    },
                    {
                        "id":830,

                        "children":[
                            {
                                "id":831,

                                "children":null,
                                "content":"燃气灶[831]"
                            },
                            {
                                "id":832,

                                "children":null,
                                "content":"油烟机[832]"
                            },
                            {
                                "id":833,

                                "children":null,
                                "content":"油烟机配件[833]"
                            }
                        ],
                        "content":"厨卫大电[830]"
                    },
                    {
                        "id":723,

                        "children":[
                            {
                                "id":760,

                                "children":null,
                                "content":"电饭煲[760]"
                            },
                            {
                                "id":771,

                                "children":null,
                                "content":"电磁炉[771]"
                            },
                            {
                                "id":773,

                                "children":null,
                                "content":"压力锅[773]"
                            },
                            {
                                "id":855,

                                "children":null,
                                "content":"微蒸烤[855]"
                            },
                            {
                                "id":754,

                                "children":null,
                                "content":"料理机[754]"
                            },
                            {
                                "id":755,

                                "children":null,
                                "content":"饮水机[755]"
                            },
                            {
                                "id":724,

                                "children":null,
                                "content":"水壶/养生壶[724]"
                            },
                            {
                                "id":782,

                                "children":null,
                                "content":"滤水壶滤芯[782]"
                            }
                        ],
                        "content":"厨卫小电[723]"
                    },
                    {
                        "id":762,

                        "children":[
                            {
                                "id":763,

                                "children":null,
                                "content":"洗衣机[763]"
                            },
                            {
                                "id":766,

                                "children":null,
                                "content":"冰箱配件[766]"
                            },
                            {
                                "id":781,

                                "children":null,
                                "content":"冰箱[781]"
                            }
                        ],
                        "content":"大家电[762]"
                    },
                    {
                        "id":728,

                        "children":[
                            {
                                "id":878,

                                "children":null,
                                "content":"显示器[878]"
                            },
                            {
                                "id":775,

                                "children":null,
                                "content":"笔[775]"
                            },
                            {
                                "id":776,

                                "children":null,
                                "content":"笔芯[776]"
                            },
                            {
                                "id":818,

                                "children":null,
                                "content":"本[818]"
                            },
                            {
                                "id":863,

                                "children":null,
                                "content":"文具周边[863]"
                            },
                            {
                                "id":729,

                                "children":null,
                                "content":"存储卡/U盘[729]"
                            },
                            {
                                "id":731,

                                "children":null,
                                "content":"网线[731]"
                            },
                            {
                                "id":817,

                                "children":null,
                                "content":"鼠标[817]"
                            },
                            {
                                "id":812,

                                "children":null,
                                "content":"键盘[812]"
                            },
                            {
                                "id":814,

                                "children":null,
                                "content":"鼠标垫[814]"
                            },
                            {
                                "id":751,

                                "children":null,
                                "content":"插线板[751]"
                            },
                            {
                                "id":752,

                                "children":null,
                                "content":"贴纸[752]"
                            },
                            {
                                "id":783,

                                "children":null,
                                "content":"打印机[783]"
                            },
                            {
                                "id":784,

                                "children":null,
                                "content":"打印机耗材[784]"
                            },
                            {
                                "id":786,

                                "children":null,
                                "content":"电脑椅[786]"
                            },
                            {
                                "id":823,

                                "children":null,
                                "content":"随身WiFi[823]"
                            }
                        ],
                        "content":"电脑/办公[728]"
                    },
                    {
                        "id":701,

                        "children":[
                            {
                                "id":877,

                                "children":null,
                                "content":"洗手机耗材[877]"
                            },
                            {
                                "id":702,

                                "children":null,
                                "content":"口罩[702]"
                            },
                            {
                                "id":703,

                                "children":null,
                                "content":"口罩滤芯[703]"
                            },
                            {
                                "id":719,

                                "children":null,
                                "content":"血压计[719]"
                            },
                            {
                                "id":742,

                                "children":null,
                                "content":"手动牙刷[742]"
                            },
                            {
                                "id":744,

                                "children":null,
                                "content":"电动牙刷[744]"
                            },
                            {
                                "id":745,

                                "children":null,
                                "content":"牙刷头[745]"
                            },
                            {
                                "id":750,

                                "children":null,
                                "content":"体温计[750]"
                            },
                            {
                                "id":756,

                                "children":null,
                                "content":"纸巾[756]"
                            },
                            {
                                "id":764,

                                "children":null,
                                "content":"剃须刀[764]"
                            },
                            {
                                "id":765,

                                "children":null,
                                "content":"剃须刀配件[765]"
                            },
                            {
                                "id":772,

                                "children":null,
                                "content":"口腔配件[772]"
                            },
                            {
                                "id":792,

                                "children":null,
                                "content":"个护杂品[792]"
                            },
                            {
                                "id":793,

                                "children":null,
                                "content":"吹风机[793]"
                            },
                            {
                                "id":797,

                                "children":null,
                                "content":"日化洗护机[797]"
                            },
                            {
                                "id":829,

                                "children":null,
                                "content":"日化洗护机耗材[829]"
                            },
                            {
                                "id":825,

                                "children":null,
                                "content":"健康秤[825]"
                            },
                            {
                                "id":826,

                                "children":null,
                                "content":"健康秤配件[826]"
                            },
                            {
                                "id":869,

                                "children":null,
                                "content":"保健按摩[869]"
                            }
                        ],
                        "content":"个护健康[701]"
                    },
                    {
                        "id":693,

                        "children":[
                            {
                                "id":694,

                                "children":null,
                                "content":"床上用品[694]"
                            },
                            {
                                "id":696,

                                "children":null,
                                "content":"家具[696]"
                            },
                            {
                                "id":695,

                                "children":null,
                                "content":"护颈枕[695]"
                            },
                            {
                                "id":697,

                                "children":null,
                                "content":"腰靠[697]"
                            },
                            {
                                "id":717,

                                "children":null,
                                "content":"厨卫配件[717]"
                            },
                            {
                                "id":758,

                                "children":null,
                                "content":"雨伞雨具[758]"
                            },
                            {
                                "id":761,

                                "children":null,
                                "content":"五金工具[761]"
                            },
                            {
                                "id":759,

                                "children":null,
                                "content":"锅[759]"
                            },
                            {
                                "id":791,

                                "children":null,
                                "content":"餐具[791]"
                            },
                            {
                                "id":835,

                                "children":null,
                                "content":"毛巾浴巾[835]"
                            },
                            {
                                "id":713,

                                "children":null,
                                "content":"杯子[713]"
                            },
                            {
                                "id":785,

                                "children":null,
                                "content":"驱蚊用品[785]"
                            },
                            {
                                "id":813,

                                "children":null,
                                "content":"驱蚊片[813]"
                            }
                        ],
                        "content":"家居/家具[693]"
                    },
                    {
                        "id":714,

                        "children":[
                            {
                                "id":715,

                                "children":null,
                                "content":"电玩具[715]"
                            },
                            {
                                "id":798,

                                "children":null,
                                "content":"非电玩具[798]"
                            },
                            {
                                "id":806,

                                "children":null,
                                "content":"玩具配件[806]"
                            },
                            {
                                "id":726,

                                "children":null,
                                "content":"米兔玩偶[726]"
                            },
                            {
                                "id":747,

                                "children":null,
                                "content":"电子教育[747]"
                            },
                            {
                                "id":801,

                                "children":null,
                                "content":"儿童手表[801]"
                            },
                            {
                                "id":799,

                                "children":null,
                                "content":"定位电话[799]"
                            },
                            {
                                "id":807,

                                "children":null,
                                "content":"儿童拉杆箱[807]"
                            },
                            {
                                "id":804,

                                "children":null,
                                "content":"儿童书包[804]"
                            },
                            {
                                "id":730,

                                "children":null,
                                "content":"儿童眼镜[730]"
                            },
                            {
                                "id":743,

                                "children":null,
                                "content":"儿童牙刷[743]"
                            },
                            {
                                "id":800,

                                "children":null,
                                "content":"儿童保温杯[800]"
                            },
                            {
                                "id":802,

                                "children":null,
                                "content":"儿童口罩[802]"
                            },
                            {
                                "id":803,

                                "children":null,
                                "content":"童车[803]"
                            },
                            {
                                "id":805,

                                "children":null,
                                "content":"童鞋[805]"
                            },
                            {
                                "id":809,

                                "children":null,
                                "content":"小飞机[809]"
                            },
                            {
                                "id":808,

                                "children":null,
                                "content":"小飞机配件[808]"
                            },
                            {
                                "id":810,

                                "children":null,
                                "content":"理发器[810]"
                            },
                            {
                                "id":811,

                                "children":null,
                                "content":"婴儿推车[811]"
                            },
                            {
                                "id":834,

                                "children":null,
                                "content":"儿童毛巾[834]"
                            }
                        ],
                        "content":"米兔/儿童[714]"
                    },
                    {
                        "id":930,

                        "children":null,
                        "content":"医疗器械[930]"
                    },
                    {
                        "id":769,

                        "children":[
                            {
                                "id":770,

                                "children":null,
                                "content":"加湿器[770]"
                            },
                            {
                                "id":777,

                                "children":null,
                                "content":"净水器[777]"
                            },
                            {
                                "id":820,

                                "children":null,
                                "content":"净水器滤芯[820]"
                            },
                            {
                                "id":778,

                                "children":null,
                                "content":"空气净化器[778]"
                            },
                            {
                                "id":779,

                                "children":null,
                                "content":"空净滤芯[779]"
                            },
                            {
                                "id":780,

                                "children":null,
                                "content":"电暖器[780]"
                            },
                            {
                                "id":787,

                                "children":null,
                                "content":"扫地机器人[787]"
                            },
                            {
                                "id":788,

                                "children":null,
                                "content":"扫地机器人配件[788]"
                            },
                            {
                                "id":790,

                                "children":null,
                                "content":"清洁机[790]"
                            },
                            {
                                "id":861,

                                "children":null,
                                "content":"清洁机配件[861]"
                            },
                            {
                                "id":794,

                                "children":null,
                                "content":"新风机[794]"
                            },
                            {
                                "id":795,

                                "children":null,
                                "content":"新风机滤芯[795]"
                            },
                            {
                                "id":796,

                                "children":null,
                                "content":"风扇[796]"
                            }
                        ],
                        "content":"生活电器[769]"
                    },
                    {
                        "id":682,

                        "children":[
                            {
                                "id":689,

                                "children":null,
                                "content":"充电器/电池[689]"
                            },
                            {
                                "id":686,

                                "children":null,
                                "content":"耳机[686]"
                            },
                            {
                                "id":740,

                                "children":null,
                                "content":"耳机配件[740]"
                            },
                            {
                                "id":718,

                                "children":null,
                                "content":"数据线[718]"
                            },
                            {
                                "id":683,

                                "children":null,
                                "content":"移动电源[683]"
                            },
                            {
                                "id":684,

                                "children":null,
                                "content":"移动电源配件[684]"
                            },
                            {
                                "id":711,

                                "children":null,
                                "content":"自拍杆[711]"
                            }
                        ],
                        "content":"手机周边[682]"
                    },
                    {
                        "id":680,

                        "children":[
                            {
                                "id":681,

                                "children":null,
                                "content":"服装鞋帽[681]"
                            },
                            {
                                "id":687,

                                "children":null,
                                "content":"眼镜/配饰[687]"
                            },
                            {
                                "id":698,

                                "children":null,
                                "content":"收纳袋[698]"
                            },
                            {
                                "id":699,

                                "children":null,
                                "content":"箱子[699]"
                            },
                            {
                                "id":700,

                                "children":null,
                                "content":"包[700]"
                            }
                        ],
                        "content":"箱包/服饰[680]"
                    },
                    {
                        "id":676,

                        "children":[
                            {
                                "id":708,

                                "children":null,
                                "content":"生态链音箱[708]"
                            },
                            {
                                "id":716,

                                "children":null,
                                "content":"投影仪[716]"
                            },
                            {
                                "id":774,

                                "children":null,
                                "content":"激光投影电视[774]"
                            },
                            {
                                "id":727,

                                "children":null,
                                "content":"乐器[727]"
                            },
                            {
                                "id":827,

                                "children":null,
                                "content":"收音机[827]"
                            },
                            {
                                "id":739,

                                "children":null,
                                "content":"影音配件[739]"
                            }
                        ],
                        "content":"影音娱乐[676]"
                    },
                    {
                        "id":690,

                        "children":[
                            {
                                "id":692,

                                "children":null,
                                "content":"行车记录仪[692]"
                            },
                            {
                                "id":709,

                                "children":null,
                                "content":"相机[709]"
                            },
                            {
                                "id":722,

                                "children":null,
                                "content":"滑板车[722]"
                            },
                            {
                                "id":725,

                                "children":null,
                                "content":"平衡车[725]"
                            },
                            {
                                "id":748,

                                "children":null,
                                "content":"自行车[748]"
                            },
                            {
                                "id":749,

                                "children":null,
                                "content":"骑行配件[749]"
                            },
                            {
                                "id":732,

                                "children":null,
                                "content":"健身器材[732]"
                            },
                            {
                                "id":741,

                                "children":null,
                                "content":"车载充电器[741]"
                            },
                            {
                                "id":691,

                                "children":null,
                                "content":"车载配件[691]"
                            },
                            {
                                "id":767,

                                "children":null,
                                "content":"车载空气净化器[767]"
                            },
                            {
                                "id":768,

                                "children":null,
                                "content":"车载空气净化器滤芯[768]"
                            },
                            {
                                "id":819,

                                "children":null,
                                "content":"对讲机[819]"
                            },
                            {
                                "id":753,

                                "children":null,
                                "content":"对讲机配件[753]"
                            },
                            {
                                "id":824,

                                "children":null,
                                "content":"手电筒[824]"
                            },
                            {
                                "id":710,

                                "children":null,
                                "content":"数码配件[710]"
                            }
                        ],
                        "content":"运动出行[690]"
                    },
                    {
                        "id":704,

                        "children":[
                            {
                                "id":706,

                                "children":null,
                                "content":"手环[706]"
                            },
                            {
                                "id":707,

                                "children":null,
                                "content":"智能手表[707]"
                            },
                            {
                                "id":705,

                                "children":null,
                                "content":"手环/手表配件[705]"
                            },
                            {
                                "id":736,

                                "children":null,
                                "content":"吸顶灯[736]"
                            },
                            {
                                "id":735,

                                "children":null,
                                "content":"台灯[735]"
                            },
                            {
                                "id":737,

                                "children":null,
                                "content":"氛围灯[737]"
                            },
                            {
                                "id":734,

                                "children":null,
                                "content":"光源[734]"
                            },
                            {
                                "id":738,

                                "children":null,
                                "content":"灯配件[738]"
                            },
                            {
                                "id":746,

                                "children":null,
                                "content":"摄像机[746]"
                            },
                            {
                                "id":757,

                                "children":null,
                                "content":"智能家庭设备[757]"
                            },
                            {
                                "id":721,

                                "children":null,
                                "content":"检测仪[721]"
                            },
                            {
                                "id":816,

                                "children":null,
                                "content":"闹钟[816]"
                            },
                            {
                                "id":822,

                                "children":null,
                                "content":"智能门锁[822]"
                            },
                            {
                                "id":828,

                                "children":null,
                                "content":"无人机[828]"
                            },
                            {
                                "id":815,

                                "children":null,
                                "content":"无人机配件[815]"
                            },
                            {
                                "id":821,

                                "children":null,
                                "content":"翻译机[821]"
                            },
                            {
                                "id":733,

                                "children":null,
                                "content":"模组[733]"
                            }
                        ],
                        "content":"智能设备[704]"
                    },
                    {
                        "id":678,

                        "children":[
                            {
                                "id":679,

                                "children":null,
                                "content":"礼品[679]"
                            },
                            {
                                "id":720,

                                "children":null,
                                "content":"金银首饰[720]"
                            },
                            {
                                "id":789,

                                "children":null,
                                "content":"石英表[789]"
                            }
                        ],
                        "content":"钟表/珠宝首饰/礼品[678]"
                    },
                    {
                        "id":845,

                        "children":[
                            {
                                "id":677,

                                "children":null,
                                "content":"电视配件[677]"
                            },
                            {
                                "id":685,

                                "children":null,
                                "content":"手机配件[685]"
                            },
                            {
                                "id":847,

                                "children":null,
                                "content":"壳膜套[847]"
                            }
                        ],
                        "content":"手机电视配件[845]"
                    }
                ],
                "content":"生态链[674]"
            }
        ],
        "content":"商品[1]"
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
        noFoundTip="未搜索到相关内容"
        searchable={true}
        data={this.state.options}
        style={{ width: 240 }}
      />
    )
  }
}`,
    opt: ['搜索']
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
                  id: '小米1',
                  content: '小米1'
                },
                {
                  id: '小米2',
                  content: '小米2',
                  disabled: true
                },
                {
                  id: '小米3',
                  content: '小米3'
                },
                {
                  id: '小米4',
                  content: '小米4'
                },
                {
                  id: '小米5',
                  content: '小米5'
                },
                {
                  id: '小米6',
                  content: '小米6'
                },
                {
                  id: '小米7',
                  content: '小米7'
                },
                {
                  id: '小米8',
                  content: '小米8'
                }
              ]
            },
            {
              id: '红米',
              content: '红米',
              children: [
                {
                  id: '红米1',
                  content: '红米1'
                },
                {
                  id: '红米2',
                  content: '红米2'
                },
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
            },
            {
              id: '小米电视4X',
              content: '小米电视4X'
            },
            {
              id: '小米电视4',
              content: '小米电视4'
            }
          ]
        },
        {
          id: 'mix',
          content: 'Mix',
          children: []
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
        onActiveItemChange={values=>{
          if(values[0] == 'mix') {
            setTimeout(()=>{
              this.state.options[2].children = [
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
              this.forceUpdate()
            }, 1000)
          }
        }}
      />
    )
  }
}`,
    opt: ['动态加载选项']
  }
]

const DemoBasic = () => (
  <DocViewer
    code={code}
    scope={{ Cascader }}
    prefix={prefix}
    rightOptions={rightOptions}
  />
)
export default DemoBasic
