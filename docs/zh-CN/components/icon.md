<style scoped>

.hiicon-list {
  width: 100%;
}

.hiicon-list li {
  list-style: none;
  float: left;
  width: 16.6%;
  height: 120px;
  border-radius: 4px;
  color: #333;
  text-align: center;
  transition: color, background-color 0.2s;
}

.hiicon-list li:hover {
  background: #4284f5;
  color: #fff;
}

.hiicon-list .hi-icon {
  margin: 20px 0;
  font-size: 32px;
  display: inline-block;
}

.hiicon-class {
  font-size: 12px;
  display: block;
}

</style>

## Icon 图标

Icon 图标

### 基础用法

:::demo

Icon 图标

```js
render () {
  return (
    <div>
      <Icon name="info-circle-o" style={{color: '#4284F5', fontSize: '24px'}} />
      <Icon name="check-circle-o" style={{color: '#1DA653', fontSize: '24px'}} />
      <Icon name="close-circle-o" style={{color: '#EB5252', fontSize: '24px'}} />
      <Icon name="close" style={{color: '#999', fontSize: '24px'}} />
    </div>
  )
}
```

:::

### 嵌套用法

:::demo

icon 嵌套图标

```js
render () {
  return (
    <div>
      <Button type="default"><Icon name="close" /></Button>
      <Button type="line"><Icon name="edit" /> 编辑</Button>
    </div>
  )
}
```

:::

### Icon Attributes

| 参数      | 说明         | 类型   | 可选值       | 默认值 |
| --------- | ------------ | ------ | ------------ | ------ |
| name      | 图标名称     | string | 参考图标集合 | -      |

### 图标集合

<ul class='hiicon-list'>
  <li>
    <i class='hi-icon icon-up'></i>
    <span class='hiicon-class'>up</span>
  </li>
  <li>
    <i class='hi-icon icon-down'></i>
    <span class='hiicon-class'>down</span>
  </li>
  <li>
    <i class='hi-icon icon-left'></i>
    <span class='hiicon-class'>left</span>
  </li>
  <li>
    <i class='hi-icon icon-right'></i>
    <span class='hiicon-class'>right</span>
  </li>
  <li>
    <i class='hi-icon icon-double-left'></i>
    <span class='hiicon-class'>double-left</span>
  </li>
  <li>
    <i class='hi-icon icon-double-right'></i>
    <span class='hiicon-class'>double-right</span>
  </li>
  <li>
    <i class='hi-icon icon-arrow-left'></i>
    <span class='hiicon-class'>arrow-left</span>
  </li>
  <li>
    <i class='hi-icon icon-arrow-right'></i>
    <span class='hiicon-class'>arrow-right</span>
  </li>
  <li>
    <i class='hi-icon icon-top'></i>
    <span class='hiicon-class'>top</span>
  </li>
  <li>
    <i class='hi-icon icon-bottom'></i>
    <span class='hiicon-class'>bottom</span>
  </li>
  <li>
    <i class='hi-icon icon-plus'></i>
    <span class='hiicon-class'>plus</span>
  </li>
  <li>
    <i class='hi-icon icon-minus'></i>
    <span class='hiicon-class'>minus</span>
  </li>
  <li>
    <i class='hi-icon icon-check'></i>
    <span class='hiicon-class'>check</span>
  </li>
  <li>
    <i class='hi-icon icon-close'></i>
    <span class='hiicon-class'>close</span>
  </li>
  <li>
    <i class='hi-icon icon-check-circle-o'></i>
    <span class='hiicon-class'>check-circle-o</span>
  </li>
  <li>
    <i class='hi-icon icon-close-circle-o'></i>
    <span class='hiicon-class'>close-circle-o</span>
  </li>
  <li>
    <i class='hi-icon icon-close-circle'></i>
    <span class='hiicon-class'>close-circle</span>
  </li>
  <li>
    <i class='hi-icon icon-circle'></i>
    <span class='hiicon-class'>circle</span>
  </li>
  <li>
    <i class='hi-icon icon-square-selected-not'></i>
    <span class='hiicon-class'>square-selected-not</span>
  </li>
  <li>
    <i class='hi-icon icon-square-selected'></i>
    <span class='hiicon-class'>square-selected</span>
  </li>

  <li>
    <i class='hi-icon icon-alarm'></i>
    <span class='hiicon-class'>alarm</span>
  </li>
  <li>
    <i class='hi-icon icon-alarm-clock'></i>
    <span class='hiicon-class'>alarm-clock</span>
  </li>
  <li>
    <i class='hi-icon icon-approve'></i>
    <span class='hiicon-class'>approve</span>
  </li>
  <li>
    <i class='hi-icon icon-archive'></i>
    <span class='hiicon-class'>archive</span>
  </li>
  <li>
    <i class='hi-icon icon-application-lock'></i>
    <span class='hiicon-class'>application-lock</span>
  </li>

  <li>
    <i class='hi-icon icon-man'></i>
    <span class='hiicon-class'>man</span>
  </li>
  <li>
    <i class='hi-icon icon-woman'></i>
    <span class='hiicon-class'>woman</span>
  </li>
  <li>
    <i class='hi-icon icon-building'></i>
    <span class='hiicon-class'>building</span>
  </li>
  <li>
    <i class='hi-icon icon-chat-group'></i>
    <span class='hiicon-class'>chat-group</span>
  </li>
  <li>
    <i class='hi-icon icon-list'></i>
    <span class='hiicon-class'>list</span>
  </li>
  <li>
    <i class='hi-icon icon-menu'></i>
    <span class='hiicon-class'>menu</span>
  </li>

  <li>
    <i class='hi-icon icon-collection'></i>
    <span class='hiicon-class'>collection</span>
  </li>
  <li>
    <i class='hi-icon icon-comment-circle-o'></i>
    <span class='hiicon-class'>comment-circle-o</span>
  </li>
  <li>
    <i class='hi-icon icon-copy'></i>
    <span class='hiicon-class'>copy</span>
  </li>
  <li>
    <i class='hi-icon icon-cut'></i>
    <span class='hiicon-class'>cut</span>
  </li>
  <li>
    <i class='hi-icon icon-collection-list'></i>
    <span class='hiicon-class'>collection-list</span>
  </li>
  <li>
    <i class='hi-icon icon-component'></i>
    <span class='hiicon-class'>component</span>
  </li>
  <li>
    <i class='hi-icon icon-data'></i>
    <span class='hiicon-class'>data</span>
  </li>

  <li>
    <i class='hi-icon icon-date-end'></i>
    <span class='hiicon-class'>date-end</span>
  </li>
  <li>
    <i class='hi-icon icon-date-start'></i>
    <span class='hiicon-class'>date-start</span>
  </li>
  <li>
    <i class='hi-icon icon-date'></i>
    <span class='hiicon-class'>date</span>
  </li>
  <li>
    <i class='hi-icon icon-delete'></i>
    <span class='hiicon-class'>delete</span>
  </li>
  <li>
    <i class='hi-icon icon-document'></i>
    <span class='hiicon-class'>document</span>
  </li>

  <li>
    <i class='hi-icon icon-download'></i>
    <span class='hiicon-class'>download</span>
  </li>
  <li>
    <i class='hi-icon icon-edit'></i>
    <span class='hiicon-class'>edit</span>
  </li>
  <li>
    <i class='hi-icon icon-email'></i>
    <span class='hiicon-class'>email</span>
  </li>

  <li>
    <i class='hi-icon icon-email-open'></i>
    <span class='hiicon-class'>email-open</span>
  </li>
  <li>
    <i class='hi-icon icon-expand-alt'></i>
    <span class='hiicon-class'>expand-alt</span>
  </li>
  <li>
    <i class='hi-icon icon-shrink'></i>
    <span class='hiicon-class'>shrink</span>
  </li>
  <li>
    <i class='hi-icon icon-fullscreen-exit'></i>
    <span class='hiicon-class'>fullscreen-exit</span>
  </li>
  <li>
    <i class='hi-icon icon-fullscreen'></i>
    <span class='hiicon-class'>fullscreen</span>
  </li>
  <li>
    <i class='hi-icon icon-export'></i>
    <span class='hiicon-class'>export</span>
  </li>
  <li>
    <i class='hi-icon icon-eye'></i>
    <span class='hiicon-class'>eye</span>
  </li>
  <li>
    <i class='hi-icon icon-face'></i>
    <span class='hiicon-class'>face</span>
  </li>
  <li>
    <i class='hi-icon icon-folder'></i>
    <span class='hiicon-class'>folder</span>
  </li>

  <li>
    <i class='hi-icon icon-hide'></i>
    <span class='hiicon-class'>hide</span>
  </li>
  <li>
    <i class='hi-icon icon-home'></i>
    <span class='hiicon-class'>home</span>
  </li>
  <li>
    <i class='hi-icon icon-html'></i>
    <span class='hiicon-class'>html</span>
  </li>
  <li>
    <i class='hi-icon icon-info-circle-o'></i>
    <span class='hiicon-class'>info-circle-o</span>
  </li>

  <li>
    <i class='hi-icon icon-info'></i>
    <span class='hiicon-class'>info</span>
  </li>

  <li>
    <i class='hi-icon icon-internet'></i>
    <span class='hiicon-class'>internet</span>
  </li>
  <li>
    <i class='hi-icon icon-label'></i>
    <span class='hiicon-class'>label</span>
  </li>
  <li>
    <i class='hi-icon icon-linechart'></i>
    <span class='hiicon-class'>linechart</span>
  </li>
  <li>
    <i class='hi-icon icon-lock'></i>
    <span class='hiicon-class'>lock</span>
  </li>

  <li>
    <i class='hi-icon icon-link'></i>
    <span class='hiicon-class'>link</span>
  </li>
  <li>
    <i class='hi-icon icon-mail-delivery'></i>
    <span class='hiicon-class'>mail-delivery</span>
  </li>
  <li>
    <i class='hi-icon icon-mark'></i>
    <span class='hiicon-class'>mark</span>
  </li>
  <li>
    <i class='hi-icon icon-message'></i>
    <span class='hiicon-class'>message</span>
  </li>

  <li>
    <i class='hi-icon icon-money-circle-o'></i>
    <span class='hiicon-class'>money-circle-o</span>
  </li>
  <li>
    <i class='hi-icon icon-more-circle-o'></i>
    <span class='hiicon-class'>more-circle-o</span>
  </li>
  <li>
    <i class='hi-icon icon-more'></i>
    <span class='hiicon-class'>more</span>
  </li>
  <li>
    <i class='hi-icon icon-move-to'></i>
    <span class='hiicon-class'>move-to</span>
  </li>
  <li>
    <i class='hi-icon icon-paste'></i>
    <span class='hiicon-class'>paste</span>
  </li>
  <li>
    <i class='hi-icon icon-move'></i>
    <span class='hiicon-class'>move</span>
  </li>

  <li>
    <i class='hi-icon icon-play'></i>
    <span class='hiicon-class'>play</span>
  </li>
  <li>
    <i class='hi-icon icon-pause'></i>
    <span class='hiicon-class'>pause</span>
  </li>
  <li>
    <i class='hi-icon icon-pc'></i>
    <span class='hiicon-class'>pc</span>
  </li>
  <li>
    <i class='hi-icon icon-phone'></i>
    <span class='hiicon-class'>phone</span>
  </li>
  <li>
    <i class='hi-icon icon-pic'></i>
    <span class='hiicon-class'>pic</span>
  </li>
  <li>
    <i class='hi-icon icon-pie-chart'></i>
    <span class='hiicon-class'>pie-chart</span>
  </li>

  <li>
    <i class='hi-icon icon-polyline'></i>
    <span class='hiicon-class'>polyline</span>
  </li>
  <li>
    <i class='hi-icon icon-position'></i>
    <span class='hiicon-class'>position</span>
  </li>
  <li>
    <i class='hi-icon icon-problem-circle-o'></i>
    <span class='hiicon-class'>problem-circle-o</span>
  </li>
  <li>
    <i class='hi-icon icon-process'></i>
    <span class='hiicon-class'>process</span>
  </li>
  <li>
    <i class='hi-icon icon-prompt'></i>
    <span class='hiicon-class'>prompt</span>
  </li>

  <li>
    <i class='hi-icon icon-power-off'></i>
    <span class='hiicon-class'>power-off</span>
  </li>
  <li>
    <i class='hi-icon icon-plugin'></i>
    <span class='hiicon-class'>plugin</span>
  </li>
  <li>
    <i class='hi-icon icon-refer'></i>
    <span class='hiicon-class'>refer</span>
  </li>
  <li>
    <i class='hi-icon icon-qr'></i>
    <span class='hiicon-class'>qr</span>
  </li>
  <li>
    <i class='hi-icon icon-repeat'></i>
    <span class='hiicon-class'>repeat</span>
  </li>

  <li>
    <i class='hi-icon icon-save'></i>
    <span class='hiicon-class'>save</span>
  </li>
  <li>
    <i class='hi-icon icon-scan'></i>
    <span class='hiicon-class'>scan</span>
  </li>
  <li>
    <i class='hi-icon icon-search'></i>
    <span class='hiicon-class'>search</span>
  </li>
  <li>
    <i class='hi-icon icon-share'></i>
    <span class='hiicon-class'>share</span>
  </li>
  <li>
    <i class='hi-icon icon-set'></i>
    <span class='hiicon-class'>set</span>
  </li>
  <li>
    <i class='hi-icon icon-sound'></i>
    <span class='hiicon-class'>sound</span>
  </li>

  <li>
    <i class='hi-icon icon-stop'></i>
    <span class='hiicon-class'>stop</span>
  </li>
  <li>
    <i class='hi-icon icon-star'></i>
    <span class='hiicon-class'>star</span>
  </li>
  <li>
    <i class='hi-icon icon-thumbs-up'></i>
    <span class='hiicon-class'>thumbs-up</span>
  </li>
  <li>
    <i class='hi-icon icon-step-on'></i>
    <span class='hiicon-class'>step-on</span>
  </li>

  <li>
    <i class='hi-icon icon-store'></i>
    <span class='hiicon-class'>store</span>
  </li>
  <li>
    <i class='hi-icon icon-task'></i>
    <span class='hiicon-class'>task</span>
  </li>
  <li>
    <i class='hi-icon icon-synchronize'></i>
    <span class='hiicon-class'>synchronize</span>
  </li>
  <li>
    <i class='hi-icon icon-template'></i>
    <span class='hiicon-class'>template</span>
  </li>
  <li>
    <i class='hi-icon icon-telephone'></i>
    <span class='hiicon-class'>telephone</span>
  </li>

  <li>
    <i class='hi-icon icon-time'></i>
    <span class='hiicon-class'>time</span>
  </li>
  <li>
    <i class='hi-icon icon-tool'></i>
    <span class='hiicon-class'>tool</span>
  </li>

  <li>
    <i class='hi-icon icon-time1'></i>
    <span class='hiicon-class'>time1</span>
  </li>
  <li>
    <i class='hi-icon icon-unlock'></i>
    <span class='hiicon-class'>unlock</span>
  </li>
  <li>
    <i class='hi-icon icon-travel'></i>
    <span class='hiicon-class'>travel</span>
  </li>

  <li>
    <i class='hi-icon icon-truck'></i>
    <span class='hiicon-class'>truck</span>
  </li>
  <li>
    <i class='hi-icon icon-update'></i>
    <span class='hiicon-class'>update</span>
  </li>
  <li>
    <i class='hi-icon icon-upload'></i>
    <span class='hiicon-class'>upload</span>
  </li>
  <li>
    <i class='hi-icon icon-upload-cloud'></i>
    <span class='hiicon-class'>upload-cloud</span>
  </li>
  <li>
    <i class='hi-icon icon-user'></i>
    <span class='hiicon-class'>user</span>
  </li>

  <li>
    <i class='hi-icon icon-user-add'></i>
    <span class='hiicon-class'>user-add</span>
  </li>
  <li>
    <i class='hi-icon icon-usergroup'></i>
    <span class='hiicon-class'>usergroup</span>
  </li>
  <li>
    <i class='hi-icon icon-voice'></i>
    <span class='hiicon-class'>voice</span>
  </li>
  <li>
    <i class='hi-icon icon-web'></i>
    <span class='hiicon-class'>web</span>
  </li>

  <!-- 2019-05-21 new icon -->
  <li>
    <i class='hi-icon icon-reset'></i>
    <span class='hiicon-class'>reset</span>
  </li>
  <li>
    <i class='hi-icon icon-api'></i>
    <span class='hiicon-class'>api</span>
  </li>
  <li>
    <i class='hi-icon icon-noapi'></i>
    <span class='hiicon-class'>noapi</span>
  </li>
  <li>
    <i class='hi-icon icon-columns'></i>
    <span class='hiicon-class'>columns</span>
  </li>
  <li>
    <i class='hi-icon icon-average'></i>
    <span class='hiicon-class'>average</span>
  </li>
  <li>
    <i class='hi-icon icon-row-height'></i>
    <span class='hiicon-class'>row-height</span>
  </li>
  <li>
    <i class='hi-icon icon-caveat'></i>
    <span class='hiicon-class'>caveat</span>
  </li>
  <li>
    <i class='hi-icon icon-asc'></i>
    <span class='hiicon-class'>asc</span>
  </li>
  <li>
    <i class='hi-icon icon-desc'></i>
    <span class='hiicon-class'>desc</span>
  </li>
  <li>
    <i class='hi-icon icon-import'></i>
    <span class='hiicon-class'>import</span>
  </li>
  <li>
    <i class='hi-icon icon-freezing'></i>
    <span class='hiicon-class'>freezing</span>
  </li>
  <li>
    <i class='hi-icon icon-summation'></i>
    <span class='hiicon-class'>summation</span>
  </li>
  <li>
    <i class='hi-icon icon-screen'></i>
    <span class='hiicon-class'>screen</span>
  </li>
  <li>
    <i class='hi-icon icon-stattistics'></i>
    <span class='hiicon-class'>stattistics</span>
  </li>
</ul>
