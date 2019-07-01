import Markdown from '../../../../libs/markdown'

class Card extends Markdown {
  document (locale) {
    return require('../card.md')
  }
}

export default Card
