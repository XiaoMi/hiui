import Markdown from '../../../../libs/markdown'

class Cascader extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/cascader.md`)
  }
}

export default Cascader
