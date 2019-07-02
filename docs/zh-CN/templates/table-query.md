### 查询型列表

按照一定逻辑关系的查询条件访问数据库，得到相应范围的数据

#### 基础型

适用于查询条件少，关系均为且可灵活管理条件的情况。

<a href="https://hiui-group.github.io/hiui-template/#/query-basic" target="_blank" style="margin-top:8px;">
  <img src="/hiui/static/img/templates/table5.png" width="60%"/>
</a>

<a href="https://hiui-group.github.io/hiui-template/#/query-basic" target="_blank">查看 Demo</a>
&nbsp;&nbsp;
<a href="https://github.com/hiui-group/hiui-template" target="_blank">Github</a>

> 规则
>
> 1. 条件个数，至少 1 个，默认所有控件宽度不超过一行
>
> 2. 确定/重置按钮，单独一行
>
> 3. 条件之间的逻辑关系默认为：且
>
> 4. 当控件为空时，确定/重置按钮置灰，不可操作；当所有控件不为空时确定/重置高亮
>
> 5. 当需要更多的查询条件、条件逻辑为与或非时，进入高级设置

#### 平铺型

适用于查询条件数为 3-5 个，操作高频且筛选项少于 20 个的情况（多选）。

<a href="https://hiui-group.github.io/hiui-template/#/tile-multiple" target="_blank" style="margin-top:8px;">
  <img src="/hiui/static/img/templates/table6.png" width="60%"/>
</a>

<a href="https://hiui-group.github.io/hiui-template/#/tile-multiple" target="_blank">查看 Demo</a>
&nbsp;&nbsp;
<a href="https://github.com/hiui-group/hiui-template" target="_blank">Github</a>

> 规则
>
> 1. 当选项个数排列长度超过一行时，自动折行处理
>
> 2. 建议选项可按列左对齐，选项内容长度过长时，以省略号收起

适用于查询条件数为 3-5 个，操作高频且筛选项少于 20 个的情况（单选）。

<a href="https://hiui-group.github.io/hiui-template/#/tile-single" target="_blank" style="margin-top:8px;">
  <img src="/hiui/static/img/templates/table7.png" width="60%"/>
</a>

<a href="https://hiui-group.github.io/hiui-template/#/tile-single" target="_blank">查看 Demo</a>
&nbsp;&nbsp;
<a href="https://github.com/hiui-group/hiui-template" target="_blank">Github</a>

> 规则
>
> 1. 当选项个数排列长度超过一行时，自动折行处理
>
> 2. 选项胶囊长度相同，当选项内容超过时，以省略号收起

#### 树型

适用于查询条件为多叉树结构的情况（单选）：

<a href="https://hiui-group.github.io/hiui-template/#/tree-single-query" target="_blank" style="margin-top:8px;">
  <img src="/hiui/static/img/templates/table8.png" width="60%"/>
</a>

<a href="https://hiui-group.github.io/hiui-template/#/tree-single-query" target="_blank">查看 Demo</a>
&nbsp;&nbsp;
<a href="https://github.com/hiui-group/hiui-template" target="_blank">Github</a>

> 规则
>
> 1. 默认状态为展示到一级，可支持到 3 级以上，只可操作叶子节点
>
> 2. 当层级超过 3 级时，需要出现横向滚动条，同时，当展开树的高度超出时，需借助纵向滚动条

适用于查询条件为多叉树结构的情况（多选）。

<a href="https://hiui-group.github.io/hiui-template/#/tree-multiple-query" target="_blank" style="margin-top:8px;">
  <img src="/hiui/static/img/templates/table9.png" width="60%"/>
</a>

<a href="https://hiui-group.github.io/hiui-template/#/tree-multiple-query" target="_blank">查看 Demo</a>
&nbsp;&nbsp;
<a href="https://github.com/hiui-group/hiui-template" target="_blank">Github</a>

> 规则
>
> 1. 当层级多于 3 级或展开高度溢出时，借助横向、纵向滚动条查看内容
>
> 2. 确定/重置按钮组的位置，随树的高度而变化
