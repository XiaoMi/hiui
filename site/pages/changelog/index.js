import Markdown from '../../../libs/markdown'

class Changelog extends Markdown {
  document (locale) {
    return require('../../../CHANGELOG.md')
  }
}

export default Changelog
