import React from 'react'
import { Icon } from '@hi-ui/hiui'
// History.createHashHistory()

const siders = {
  products: [
    {
      title: '小米手机',
      icon: <Icon name='usergroup' />,
      children: [
        {
          title: '小米 MIX3',
          to: '/products/mix3'
        },
        {
          title: '小米8青春版',
          to: '/products/mi8/white'
        },
        {
          title: '红米系列',
          children: [
            {
              title: '红米6',
              to: '/products/mi6'
            },
            {
              title: '红米6 Pro'
            },
            {
              title: '红米6A'
            },
            {
              title: '红米 Note5'
            }
          ]
        }
      ]
    },
    {
      title: '电视品类',
      icon: <Icon name='usergroup' />,
      children: [
        {
          title: '小米电视4S',
          to: '/products/tv4s'
        },
        {
          title: '小米电视4A',
          to: '/products/tv4a'
        }
      ]
    }
  ],
  statistics: [
    {
      title: '销量统计',
      icon: <Icon name='usergroup' />,
      children: [
        {
          title: '手机销量',
          to: '/statistics/phone'
        },
        {
          title: '电视销量',
          to: '/statistics/tv'
        }
      ]
    }
  ]
}
// const siders = {
//   extend: <Login {...login} />,
//   items: [
//     {
//       title: '小米手机',
//       icon: <Icon name='usergroup' />,
//       children: [
//         {
//           title: '小米 MIX3',
//           to: '/products/mix3'
//         },
//         {
//           title: '小米8青春版',
//           to: '/products/mi8'
//         },
//         {
//           title: '红米系列',
//           children: [
//             {
//               title: '红米6',
//               to: '/products/mi6'
//             },
//             {
//               title: '红米6 Pro'
//             },
//             {
//               title: '红米6A'
//             },
//             {
//               title: '红米 Note5'
//             }
//           ]
//         }
//       ]
//     },
//     {
//       title: '电视品类',
//       icon: <Icon name='usergroup' />,
//       children: [
//         {
//           title: '小米电视4S',
//           to: '/products/tv4s'
//         },
//         {
//           title: '小米电视4A',
//           to: '/products/tv4a'
//         }
//       ]
//     }
//   ]
// }
export default siders
