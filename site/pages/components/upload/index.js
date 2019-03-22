import Markdown from '../../../../libs/markdown'

class Upload extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/upload.md`)
  }
}

export default Upload
