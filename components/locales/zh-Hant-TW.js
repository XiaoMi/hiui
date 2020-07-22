module.exports = {
  misc: {
    components: '基礎組件'
  },
  datePicker: {
    ok: '確認',
    to: '至',
    placeholder: '請選擇日期',
    dateChoose: '日期選擇',
    timeChoose: '時間選擇',
    undefinedType: '類型未定義',
    lastWeek: '近壹周',
    lastMonth: '近壹月',
    lastThreeMonth: '近三月',
    lastYear: '近壹年',
    month: [ '壹月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十壹月', '十二月' ],
    monthShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    week: [ '日', '壹', '二', '三', '四', '五', '六' ],
    placeholders: {
      date: '請選擇日期',
      month: '請選擇月',
      year: '請選擇年',
      time: '請選擇時間',
      daterange: '請選擇日期',
      week: '請選擇周',
      weekrange: '請選擇周'
    },
    year: '年',
    timePeriod: '時間段',
    hours: '時',
    minutes: '分',
    seconds: '秒',
    weekrange: function (year, week) {
      return year + '-W' + week
    }
  },
  pagination: {
    total: function (total) {
      return '共 ' + total + ' 條'
    },
    item: '條',
    itemPerPage: '每頁',
    goto: '跳至',
    page: '頁'
  },
  cascader: {
    placeholder: '請選擇',
    noFoundTip: '無匹配數據'
  },
  select: {
    placeholder: '請選擇',
    noFoundTip: '無匹配數據'
  },
  upload: {
    buttonText: '本地上傳',
    uploadSuccess: '上傳成功',
    uploadFailed: '上傳失敗',
    cancel: '取消',
    delete: '刪除',
    drag: '拖拽文件上傳',
    dragTips: '請點擊或拖拽文件上傳',
    dragTipsLimited: '數量已達上限',
    modalTiptitle: '上傳失敗',
    modalTiptxt: '該上傳文件超過指定上傳文件大小',
    modalBtn: '我知道了',
    modalTitle: '提示'
  },
  modal: {
    confirmText: '確定',
    cancelText: '取消'
  },
  tabs: {
    more: '更多'
  },
  timeline: {
    expand: '展開',
    collapse: '收起'
  },
  form: {
    colon: '：'
  }
}
