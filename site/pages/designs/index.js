const designs = {}
const files = require.context(`../../../docs/zh-CN/designs`, false, /.mdx$/)
files.keys().forEach(key => {
  let _key = key.split('/')[1].split('.')[0]
  designs[_key] = files(key).default
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
      'content-layout': designs['content-layout'],
      // palette: designs['palette'],
      font: designs['font'],
      icon: designs['icon'],
      image: designs['image']
    }
  }
}
