import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Table from '../../../components/table'
const prefix = 'table-column'
const desc = ['列对齐：根据数据形式调整对齐方式']
const rightOptions = ['列对齐', '列高亮', '列操作', '列冻结', '列调整']
const code = [
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: '商品名',
            dataKey: 'name'
          },
          {
            title: '品类',
            dataKey: 'type'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '门店',
            dataKey: 'address'
          },
          {
            title: '库存',
            dataKey: 'stock',
            align: 'right'
          }
        ]

        this.data = [
          {
            name: '小米9',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '3299.00',
            address: '华润五彩城店',
            stock: '29,000',
            key: 1
          },
          {
            name: '小米9 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '1999.00',
            address: '清河店',
            stock: '10,000',
            key: 2
          },
          {
            name: '小米8',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '2599.00',
            address: '双安店',
            stock: '12,000',
            key: 3
          },
          {
            name: 'Redmi Note7',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '999.00',
            address: '华润五彩城店',
            stock: '140,000',
            key: 4
          },
          {
            name: '小米8 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '699.00',
            address: '双安店',
            stock: '12,000',
            key: 5
          }
        ]
      }
      render() {
        return <Table columns={this.columns} data={this.data}/>
      }
    }`,
    opt: ['列对齐']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: '商品名',
            dataKey: 'name'
          },
          {
            title: '品类',
            dataKey: 'type'
          },
          {
            title: '规格',
            dataKey: 'size'
          },
          {
            title: '单价',
            dataKey: 'price',
            align: 'right'
          },
          {
            title: '门店',
            dataKey: 'address'
          },
          {
            title: '库存',
            dataKey: 'stock',
            align: 'right'
          }
        ]

        this.data = [
          {
            name: '小米9',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '3299.00',
            address: '华润五彩城店',
            stock: '29,000',
            key: 1
          },
          {
            name: '小米9 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '1999.00',
            address: '清河店',
            stock: '10,000',
            key: 2
          },
          {
            name: '小米8',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '2599.00',
            address: '双安店',
            stock: '12,000',
            key: 3
          },
          {
            name: 'Redmi Note7',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '999.00',
            address: '华润五彩城店',
            stock: '140,000',
            key: 4
          },
          {
            name: '小米8 SE',
            type: '手机',
            size: '6G+64G 全息幻彩蓝',
            price: '699.00',
            address: '双安店',
            stock: '12,000',
            key: 5
          }
        ]
      }
      render() {
        return <Table columns={this.columns} data={this.data} highlightedColKeys={['name']}/>
      }
    }`,
    opt: ['列高亮']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: 'Name',
            dataKey: 'name',
            key: 1
          },
          {
            title: 'Age',
            dataKey: 'age',
            key: 2,
            sorter (pre, next) {
              return pre.age - next.age
            }
          },
          {
            title: 'Home phone',
            colSpan: 2,
            dataKey: 'tel',
            key: 3
          },
          {
            title: 'Phone',
            dataKey: 'phone',
            key: 4,
            sorter (pre, next) {
              return pre.phone - next.phone
            }
          },
          {
            title: 'Address',
            dataKey: 'address',
            key: 5
          }
        ]

        this.data = [
          {
            key: '1',
            name: 'John Brown',
            age: 32,
            tel: '0571-22098909',
            phone: 18889898989,
            address: 'New York No. 1 Lake Park'
          },
          {
            key: '2',
            name: 'Jim Green',
            tel: '0571-22098333',
            phone: 18889898888,
            age: 42,
            address: 'London No. 1 Lake Park'
          },
          {
            key: '3',
            name: 'Joe Black',
            age: 32,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park'
          },
          {
            key: '4',
            name: 'Jim Red',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'London No. 2 Lake Park'
          },
          {
            key: '5',
            name: 'Jake White',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Dublin No. 2 Lake Park'
          }
        ]
      }
      render() {
        return <Table columns={this.columns} data={this.data} showColMenu />
      }
    }`,
    opt: ['列操作']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.state={
          columns: [
            { key: 'source', dataKey: 'source', title: '平台', width: 200 },
            {
              key: 'storeName',
              dataKey: 'storeName',
              title: '店铺名称',
              width: 150
            },
            { key: 'priceSegment', dataKey: 'priceSegment', title: '价格段', width: 150 },
            { key: 'stBrand', dataKey: 'stBrand', title: '品牌', width: 150 },
            { key: 'stModel', dataKey: 'stModel', title: '机型', width: 150 },
            { key: 'stMemory', dataKey: 'stMemory', title: '配置', width: 350 },

            {
              key: 'receptionPrice',
              dataKey: 'receptionPrice',
              title: '到手价'
            }
          ],
          data:[]
        }
        this.columns = [
          // {dataKey: 'goodsCategory', title: '品类'},
          { key: 'source', dataKey: 'source', title: '平台', width: 80 },
          {
            key: 'storeType',
            dataKey: 'storeType',
            title: '店铺类型',
            width: 150
          },
          {
            key: 'storeName',
            dataKey: 'storeName',
            title: '店铺名称',
            width: 150
          },
          { key: 'priceSegment', dataKey: 'priceSegment', title: '价格段', width: 150 },
          { key: 'stBrand', dataKey: 'stBrand', title: '品牌', width: 150 },
          { key: 'stModel', dataKey: 'stModel', title: '机型', width: 150 },
          { key: 'stMemory', dataKey: 'stMemory', title: '配置', width: 350 },

          {
            key: 'receptionPrice',
            dataKey: 'receptionPrice',
            title: '到手价'
          }
        ]

        this.data = [
          {
            benefitInfo: '促销:满539.0减40.0',
            cartPrice: 539,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/TMALL/2020021120/4176160609724@594387510987.png',
            goodsCategory: '手机',
            key: 22,
            isFlagshipStore: '1',
            platformUrl:
              'https://detail.tmall.com/item.htm?id=594387510987&skuId=4176160609724',
            priceSegment: '0-1000',
            receptionPrice: 499,
            skuCnt: '0',
            source: '天猫',
            stBrand: 'REDMI',
            stMemory: '2GB+32GB',
            stModel: '7A',
            storeName: '小米天猫官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo: '促销:满539.0减40.0',
            cartPrice: 549,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/TMALL/2020021120/4369944479551@594387510987.png',
            goodsCategory: '手机',
            key: 39,
            isFlagshipStore: '1',
            platformUrl:
              'https://detail.tmall.com/item.htm?id=594387510987&skuId=4369944479551',
            priceSegment: '0-1000',
            receptionPrice: 509,
            skuCnt: '0',
            source: '天猫',
            stBrand: 'REDMI',
            stMemory: '3GB+32GB',
            stModel: '7A',
            storeName: '小米天猫官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo: '6期内免息',
            cartPrice: 1698.8,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/JD/2020021120/100003872923.png',
            goodsCategory: '手机',
            key: 37,
            isFlagshipStore: '1',
            platformUrl: 'https://item.jd.com/100003872923.html',
            priceSegment: '1000-2000',
            receptionPrice: 1499,
            skuCnt: '0',
            source: '京东',
            stBrand: '小米',
            stMemory: '6GB+128GB',
            stModel: 'CC9',
            storeName: '小米京东官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo: '6期内免息;促销:满3000.0减50.0',
            cartPrice: 3199,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/JD/2020021120/100009564076.png',
            goodsCategory: '手机',
            key: 21,
            isFlagshipStore: '1',
            platformUrl: 'https://item.jd.com/100009564076.html',
            priceSegment: '3000-4000',
            receptionPrice: 3049,
            skuCnt: '0',
            source: '京东',
            stBrand: '小米',
            stMemory: '8GB+256GB',
            stModel: 'CC9 PRO',
            storeName: '小米京东官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo: '6期内免息;促销:满2799.0减100.0',
            cartPrice: 2799,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/TMALL/2020021120/4259168580074@604775988717.png',
            goodsCategory: '手机',
            key: 26,
            isFlagshipStore: '1',
            platformUrl:
              'https://detail.tmall.com/item.htm?id=604775988717&skuId=4259168580074',
            priceSegment: '2000-3000',
            receptionPrice: 2699,
            skuCnt: '0',
            source: '天猫',
            stBrand: '小米',
            stMemory: '8GB+128GB',
            stModel: 'CC9 PRO',
            storeName: '小米天猫官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo: '6期内免息;促销:满2799.0减100.0',
            cartPrice: 3199,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/TMALL/2020021120/4259168580078@604775988717.png',
            goodsCategory: '手机',
            key: 28,
            isFlagshipStore: '1',
            platformUrl:
              'https://detail.tmall.com/item.htm?id=604775988717&skuId=4259168580078',
            priceSegment: '3000-4000',
            receptionPrice: 3099,
            skuCnt: '0',
            source: '天猫',
            stBrand: '小米',
            stMemory: '8GB+256GB',
            stModel: 'CC9 PRO',
            storeName: '小米天猫官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo: '6期内免息;促销:满1999.0减50.0',
            cartPrice: 1999,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/TMALL/2020021120/4160269812356@597269145005.png',
            goodsCategory: '手机',
            key: 24,
            isFlagshipStore: '1',
            platformUrl:
              'https://detail.tmall.com/item.htm?id=597269145005&skuId=4160269812356',
            priceSegment: '1000-2000',
            receptionPrice: 1949,
            skuCnt: '0',
            source: '天猫',
            stBrand: '小米',
            stMemory: '8GB+256GB',
            stModel: 'CC9 美图定制版',
            storeName: '小米天猫官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo:
              '小米 MI （赠品）小米移动电源3 10000mAh USB-C双向快充版 银色;优惠券:满980.0减60.0',
            cartPrice: 1999,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/JD/2020021120/7437712.png',
            goodsCategory: '手机',
            key: 32,
            isFlagshipStore: '1',
            platformUrl: 'https://item.jd.com/7437712.html',
            priceSegment: '1000-2000',
            receptionPrice: 1939,
            skuCnt: '0',
            source: '京东',
            stBrand: '小米',
            stMemory: '8GB+256GB',
            stModel: 'CC9 美图定制版',
            storeName: '小米京东官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 20'
          },
          {
            benefitInfo: '6期内免息',
            cartPrice: 1099,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/JD/2020021112/100003884767.png',
            goodsCategory: '手机',
            key: 38,
            isFlagshipStore: '1',
            platformUrl: 'https://item.jd.com/100003884767.html',
            priceSegment: '1000-2000',
            receptionPrice: 1049,
            skuCnt: '0',
            source: '京东',
            stBrand: '小米',
            stMemory: '6GB+64GB',
            stModel: 'CC9E',
            storeName: '小米京东官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 12'
          },
          {
            benefitInfo: '优惠券:满980.0减60.0',
            cartPrice: 2499,
            dt: '2020-02-11 00:00:00',
            fdsUrl:
              'http://cnbj1-fds.api.xiaomi.net/pricemonitor/JD/2020021103/100003582699.png',
            goodsCategory: '手机',
            key: 29,
            isFlagshipStore: '1',
            platformUrl: 'https://item.jd.com/100003582699.html',
            priceSegment: '2000-3000',
            receptionPrice: 2039,
            skuCnt: '0',
            source: '京东',
            stBrand: 'REDMI',
            stMemory: '6GB+64GB',
            stModel: 'K20 PRO',
            storeName: '小米京东官方旗舰店',
            storeType: '官方旗舰店',
            timeSegment: '2020-02-11 03'
          }
        ]
      }
      componentDidMount(){
        setTimeout(() => {
          this.setState({
            columns: this.columns,
            data: this.data
          })
        },3000)

      }
      render() {
        return <Table columns={this.state.columns} data={this.state.data} scrollWidth={1700} fixedToColumn={{left: 'storeName', right: 'receptionPrice'}} />
      }
    }`,
    opt: ['列冻结']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: 'Name',
            dataKey: 'name',
            key: 1
          },
          {
            title: 'Age',
            dataKey: 'age',
            key: 2,
            sorter (pre, next) {
              return pre.age - next.age
            }
          },
          {
            title: 'Home phone',
            colSpan: 2,
            dataKey: 'tel',
            key: 3
          },
          {
            title: 'Phone',
            dataKey: 'phone',
            key: 4,
            sorter (pre, next) {
              return pre.phone - next.phone
            }
          },
          {
            title: 'Address',
            dataKey: 'address',
            key: 5
          }
        ]

        this.data = [
          {
            key: '1',
            name: 'John Brown',
            age: 32,
            tel: '0571-22098909',
            phone: 18889898989,
            address: 'New York No. 1 Lake Park'
          },
          {
            key: '2',
            name: 'Jim Green',
            tel: '0571-22098333',
            phone: 18889898888,
            age: 42,
            address: 'London No. 1 Lake Park'
          },
          {
            key: '3',
            name: 'Joe Black',
            age: 32,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park'
          },
          {
            key: '4',
            name: 'Jim Red',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'London No. 2 Lake Park'
          },
          {
            key: '5',
            name: 'Jake White',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Dublin No. 2 Lake Park'
          }
        ]
      }
      render() {
        return <Table columns={this.columns} data={this.data} resizable bordered />
      }
    }`,
    opt: ['列伸缩']
  },
  {
    code: `import React from 'react'
    import Table from '@hi-ui/hiui/es/table'\n
    class Demo extends React.Component {
      constructor(props){
        super(props)
        this.columns = [
          {
            title: 'Name',
            dataKey: 'name',
            key: 1
          },
          {
            title: 'Age',
            dataKey: 'age',
            key: 2,
            sorter (pre, next) {
              return pre.age - next.age
            }
          },
          {
            title: 'Home phone',
            colSpan: 2,
            dataKey: 'tel',
            key: 3
          },
          {
            title: 'Phone',
            dataKey: 'phone',
            key: 4,
            sorter (pre, next) {
              return pre.phone - next.phone
            }
          },
          {
            title: 'Address',
            dataKey: 'address',
            key: 5
          }
        ]

        this.data = [
          {
            key: '1',
            name: 'John Brown',
            age: 32,
            tel: '0571-22098909',
            phone: 18889898989,
            address: 'New York No. 1 Lake Park'
          },
          {
            key: '2',
            name: 'Jim Green',
            tel: '0571-22098333',
            phone: 18889898888,
            age: 42,
            address: 'London No. 1 Lake Park'
          },
          {
            key: '3',
            name: 'Joe Black',
            age: 32,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Sidney No. 1 Lake Park'
          },
          {
            key: '4',
            name: 'Jim Red',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'London No. 2 Lake Park'
          },
          {
            key: '5',
            name: 'Jake White',
            age: 18,
            tel: '0575-22098909',
            phone: 18900010002,
            address: 'Dublin No. 2 Lake Park'
          }
        ]
      }
      render() {
        return <Table columns={this.columns} data={this.data} setting />
      }
    }`,
    opt: ['列调整']
  }
]

const DemoBase = () => (
  <DocViewer code={code} scope={{ Table }} prefix={prefix} rightOptions={rightOptions} desc={desc} />
)
export default DemoBase
