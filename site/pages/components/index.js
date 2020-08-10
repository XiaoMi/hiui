const components = {}
const files = require.context(`../../../docs/zh-CN/components`, false, /.mdx$/)
files.keys().forEach((key) => {
  let _key = key.split('/')[1].split('.')[0]
  components[_key] = files(key).default
})
export default {
  documents: {
    'quick-start': components['quick-start'],
    'upgrade-from-1x': components['upgrade-from-1x'],
    theme: components['theme'],
    palette: components['palette'],
    i18n: components['i18n'],
    changelog: components['changelog']
  },
  components: {
    new: {
      slider: components['slider'],
      list: components['list'],
      filter: components['filter'],
      table: components['table'],
      search: components['search'],
      drawer: components['drawer']
    },
    'group-basic': {
      grid: components['grid'],
      typography: components['typography'],
      button: components['button'],
      icon: components['icon'],
      watermark: components['watermark']
    },
    'group-navgation': {
      dropdown: components['dropdown'],
      pagination: components['pagination'],
      stepper: components['stepper'],
      menu: components['menu'],
      breadcrumb: components['breadcrumb']
    },
    'group-form': {
      form: components['form'],
      input: components['input'],
      search: components['search'],
      counter: components['counter'],
      select: components['select'],
      cascader: components['cascader'],
      radio: components['radio'],
      filter: components['filter'],
      checkbox: components['checkbox'],
      switch: components['switch'],
      'date-picker': components['date-picker'],
      'time-picker': components['time-picker'],
      transfer: components['transfer'],
      tree: components['tree'],
      upload: components['upload'],
      slider: components['slider'],
      rate: components['rate']
    },
    'group-data': {
      tabs: components['tabs'],
      table: components['table'],
      collapse: components['collapse'],
      tooltip: components['tooltip'],
      popover: components['popover'],
      progress: components['progress'],
      card: components['card'],
      timeline: components['timeline'],
      carousel: components['carousel'],
      list: components['list']
    },
    'group-tips': {
      modal: components['modal'],
      drawer: components['drawer'],
      notification: components['notification'],
      message: components['message'],
      alert: components['alert'],
      tag: components['tag'],
      badge: components['badge'],
      loading: components['loading']
    }
  }
}
