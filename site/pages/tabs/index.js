import Markdown from '../../../libs/markdown'

class Tabs extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/tabs.md`)
  }
}

export default Tabs
