### 筛选型列表

按照选项，快速过滤出目标数据范围



#### 全局筛选

适用于多个筛选条件的情况。


<a href="https://hiui-group.github.io/hiui-template/#/query" target="_blank" style="margin-top:8px;">
  <img src="./static/img/templates/table10.png" width="60%"/>
</a>

<a href="https://hiui-group.github.io/hiui-template/#/query" target="_blank">查看 Demo</a>
&nbsp;&nbsp;
<a href="https://github.com/hiui-group/hiui-template" target="_blank">Github</a> 

> 规则
>
> 1. 面板有最高的高度，按可放置5个条件来设定面板最高高度
>
> 2. 当条件数超出最高高度时，出现纵向滚动条
>
> 3. field的宽度有最大值，出现溢出后以省略号收起
>
> 4. 面板的宽度，随条件和控件长度变化
>
> 5. 每个条件满足筛选时，实时刷新数据结果，属于前端过滤



#### 单字段筛选

适用于仅对单个字段进行快捷过滤的场景。

<img src="./static/img/templates/table11.png" width="60%"/>

> 规则
>
> 1. 冻结，仅支持最多前两列，本列不冻结时，不出现冻结操作项
>
> 2. 菜单中的操作可视业务需求而选择，比如，无需排序可不选用，排序操作为高频率时，可提至第一项，升序和降序为一组

