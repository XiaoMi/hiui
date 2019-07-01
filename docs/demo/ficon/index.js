import Markdown from '../../../libs/markdown'

class Ficon extends Markdown {
  document (locale) {
    return require(`../../../docs/${locale}/components/ficon.md`)
  }
}

export default Ficon
