import Markdown from '../../../../libs/markdown'

class TimePicker extends Markdown {
  document (locale) {
    return require(`../../../../docs/${locale}/components/time-picker.md`)
  }
}

export default TimePicker
