import Markdown from '../../../libs/markdown'

class Cascader extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/cascader.md`)
  }
}

export default Cascader
