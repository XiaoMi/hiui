// import Markdown from '../../../libs/markdown'

// // 设计价值观
// class DesignValues extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/design-values.md`)
//   }
// }
// // 设计原则
// class DesignPrinciples extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/design-principles.md`)
//   }
// }

// // // 快速上手
// // class QuickStart extends Markdown {
// //   document (locale) {
// //     return require(`../../../docs/${locale}/designs/quick-start.md`)
// //   }
// // }
// // 概览
// class Overview extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/overview.md`)
//   }
// }
// // 布局/栅格
// class LayoutGrid extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/layout-grid.md`)
//   }
// }
// // 导航/面包屑
// class NavigationBreadcrumbs extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/navigation-breadcrumbs.md`)
//   }
// }
// // 文案
// class Copywriting extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/copywriting.md`)
//   }
// }
// // 色彩
// class Colors extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/colors.md`)
//   }
// }
// // 布局
// class Layout extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/layout.md`)
//   }
// }
// // 主题
// class Theme extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/theme.md`)
//   }
// }
// // 图标
// class Icon extends Markdown {
//   document(locale) {
//     return require(`../../../docs/${locale}/designs/icon.md`)
//   }
// }
const designs = {}
const files = require.context(`../../../docs/zh-CN/designs`, false, /.mdx$/)
files.keys().forEach(key => {
  let _key = key.split('/')[1].split('.')[0]
  designs[_key] = files(key).default
  console.log('设计价值观！！！！！！！！！！！！！！！！！！！！', designs)
})
export default {
  documents: {},
  components: {
    'about-hiui': {
      summarize: designs['summarize'],
      'design-values': designs['design-values'],
      'design-principles': designs['design-principles']
    },
    'design-patterns': {
      overview: designs['overview'],
      grid: designs['grid'],
      layout: designs['layout'],
      navigation: designs['navigation'],
      copy: designs['copy']
    },
    'visual-framework': {
      color: designs['color'],
      layout2: designs['layout2'],
      theme: designs['theme'],
      icon: designs['icon'],
      font: designs['font'],
      image: designs['image']
    }
  }
}
