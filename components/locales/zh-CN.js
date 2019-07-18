module.exports = {
  misc: {
    components: '基础组件'
  },
  datePicker: {
    ok: '确认',
    to: '至',
    placeholder: '请选择日期',
    dateChoose: '日期选择',
    timeChoose: '时间选择',
    undefinedType: '类型未定义',
    lastWeek: '近一周',
    lastMonth: '近一月',
    lastThreeMonth: '近三月',
    lastYear: '近一年',
    month: [ '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
    monthShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    week: [ '日', '一', '二', '三', '四', '五', '六' ],
    placeholders: {
      date: '请选择日期',
      month: '请选择月',
      year: '请选择年',
      time: '请选择时间',
      daterange: '请选择日期',
      week: '请选择周',
      weekrange: '请选择周'
    },
    year: '年',
    timePeriod: '时间段',
    hours: '时',
    minutes: '分',
    seconds: '秒',
    weekrange: function (year, week) {
      return year + '-W' + week
    }
  },
  pagination: {
    total: function (total) {
      return '共 ' + total + ' 条'
    },
    item: '条',
    itemPerPage: '每页',
    goto: '跳至',
    page: '页'
  },
  cascader: {
    placeholder: '请选择',
    noFoundTip: '无匹配数据'
  },
  select: {
    placeholder: '请选择',
    noFoundTip: '无匹配数据'
  },
  upload: {
    buttonText: '本地上传',
    uploadSuccess: '上传成功',
    uploadFailed: '上传失败',
    cancel: '取消',
    delete: '删除',
    drag: '拖拽文件上传',
    dragTips: '请点击或拖拽文件上传'
  },
  modal: {
    confirmText: '确定',
    cancelText: '取消'
  },
  tabs: {
    more: '更多'
  },
  timeline: {
    expand: '展开',
    collapse: '收起'
  }
}
