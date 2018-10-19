import Markdown from '../../../libs/markdown'

class Tooltip extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/tooltip.md`)
  }
}

export default Tooltip
