export default {
  documents: {
    'quick-start': require('./quick-start'),
    'theme': require('./theme')
  },
  components: {
    '基本组件': {
      'grid': require('./grid'),
      'typography': require('./typography'),
      'button': require('./button'),
      'icon': require('./icon')
      // 'ficon': require('./ficon')
    },
    '导航': {
      // 'tabs': require('./tabs'),
      'navMenu': require('./nav-menu'),
      'dropdown': require('./dropdown'),
      'pagination': require('./pagination'),
      'stepper': require('./stepper'),
      'menu': require('./menu')
    },
    '表单组件': {
      'form': require('./form'),
      'input': require('./input'),
      'counter': require('./counter'),
      'select': require('./select'),
      'radio': require('./radio'),
      'checkbox': require('./checkbox'),
      'date-picker': require('./date-picker'),
      'time-picker': require('./time-picker'),
      'upload': require('./upload')

    },
    '数据展示': {
      'table': require('./table'),
      'tree': require('./tree'),
      'panel': require('./panel'),
      'collapse': require('./collapse'),
      'tooltip': require('./tooltip'),
      'popover': require('./popover'),
      'progress': require('./progress')
    },
    '通知／提示': {
      'modal': require('./modal'),
      // 'confirm': require('./confirm'),
      'notification': require('./notification'),
      'alert': require('./alert'),
      'badge': require('./badge'),
      'loading': require('./loading')
    }
  }
}
