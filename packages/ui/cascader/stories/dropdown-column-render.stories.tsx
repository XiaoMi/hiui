import React from 'react'
import Cascader from '../src'

/**
 * @title 自定义下拉菜单内容
 */
export const DropdownColumnRender = () => {
  const [data] = React.useState([
    {
      id: '手机',
      title: '手机t',
      children: [
        {
          id: '小米',
          title: '小米t',
          children: [
            {
              id: '小米3',
              title: '小米3t',
            },
            {
              id: '小米4',
              title: '小米4t',
            },
          ],
        },
        {
          id: '红米',
          title: '红米t',
          children: [
            {
              id: '红米3',
              title: '红米3t',
            },
            {
              id: '红米4',
              title: '红米4t',
            },
          ],
        },
      ],
    },
    {
      id: '电视',
      title: '电视t',
      children: [
        {
          id: '小米电视4A',
          title: '小米电视4At',
        },
        {
          id: '小米电视4C',
          title: '小米电视4Ct',
        },
      ],
    },
    {
      id: '1',
      title: '小米1',
    },
    {
      id: '2',
      title: '小米2',
    },
    {
      id: '3',
      title: '小米3',
    },
    {
      id: '4',
      title: '小米4',
    },
    {
      id: '5',
      title: '小米5',
    },
    {
      id: '6',
      title: '小米6',
    },
    {
      id: '7',
      title: '小米7',
    },
  ])

  return (
    <>
      <h1>DropdownColumnRender</h1>
      <div className="cascader-dropdown-column-render__wrap">
        <Cascader
          style={{ width: 240 }}
          clearable
          placeholder="请选择品类"
          defaultValue={['手机', '红米', '红米4']}
          data={data}
          onChange={(...args) => {
            console.log('onChange', ...args)
          }}
          // 如果有样式不满足需求，可以给弹出层设置独有的 className 来进行样式覆写
          overlay={{ className: 'my-overlay' }}
          dropdownColumnRender={(menu, level) => {
            return level < 5 ? (
              <div
                className="custom-menu"
                style={{ overflow: 'hidden', borderRight: '1px solid #ebedf0' }}
              >
                <header
                  style={{
                    lineHeight: '20px',
                    padding: '0px 8px 8px',
                    borderBottom: '1px solid #ebedf0',
                  }}
                >
                  header
                </header>
                {React.cloneElement(menu, { style: { height: 186 } })}
                <footer
                  style={{
                    lineHeight: '20px',
                    padding: '8px 8px 0',
                    borderTop: '1px solid #ebedf0',
                  }}
                >
                  footer(level {level})
                </footer>
              </div>
            ) : (
              menu
            )
          }}
        ></Cascader>
      </div>
    </>
  )
}
