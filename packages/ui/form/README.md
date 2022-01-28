# Form 表单

用来收集数据的组件集合

## 何时使用

当系统需要收集、录入时

常见于调查问卷、登录、新建/编辑、设置等场景

## 使用示例

<!-- Inject Stories -->

## Props

### Form

| 参数           | 说明                                                                                     | 类型                                 | 可选值                     | 默认值     |
| -------------- | ---------------------------------------------------------------------------------------- | ------------------------------------ | -------------------------- | ---------- |
| initialValues  | 表单默认值，只有初始化以及重置时生效；该值是不受控的，和表单中的 defaultValue 的作用相同 | object                               | -                          | -          |
| rules          | 表单验证规则，用法参考 [async-validator](https://github.com/yiminghe/async-validator)    | object                               | -                          | -          |
| labelWidth     | label 宽度，可用任意 CSS 长度单位                                                        | string                               |                            |
| labelPlacement | label 放置的位置                                                                         | string                               | 'right' \| 'left' \| 'top' | 'left'     |
| placement      | 是否横向排列                                                                             | string                               | 'horizontal' \| 'vertical' | 'vertical' |
| showColon      | 是否显示冒号                                                                             | boolean                              | true \| false              | true       |
| innerRef       | 提供辅助方法的内部引用                                                                   | React.RefObject<FormHelpers<Values>> | -                          | -          |

## Events

| 名称           | 说明                     | 类型                                               | 参数                                                          | 返回值 |
| -------------- | ------------------------ | -------------------------------------------------- | ------------------------------------------------------------- | ------ |
| onValuesChange | 字段值更新时触发回调事件 | (changedValues: object, allValues: object) => void | changedValues: 改变的表单对象 <br/> allValues: 所有表单项对象 | -      |

## SchemaForm

> 继承 Form API

| 参数   | 说明                 | 类型         | 可选值 | 默认值 |
| ------ | -------------------- | ------------ | ------ | ------ |
| schema | 通过 schema 渲染表单 | SchemaItem[] | -      | -      |
| submit | 继承 Form.Submit API | Object       | -      | -      |
| reset  | 继承 Form.Reset API  | Object       | -      | -      |

## FormList

| 参数     | 说明     | 类型                                                             | 可选值 | 默认值 |
| -------- | -------- | ---------------------------------------------------------------- | ------ | ------ |
| name     | 列表名称 | String                                                           | -      | -      |
| children | 渲染函数 | (fields: Field[], operation: { add, remove }) => React.ReactNode | -      | -      |

## Form.Item

| 参数            | 说明                                                                                                            | 类型    | 可选值                       | 默认值   |
| --------------- | --------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------- | -------- |
| field           | 字段名，支持数组                                                                                                | string  | (string)[]                   | -        | - |
| name            | 在`Form.List`的嵌套表单中；表示该项的属性名称                                                                   | string  | -                            | -        | - |
| row             | 在`Form.List` 表示列表的第几行, 设置指定列表表单项时有用                                                        | any     | -                            | -        | - |
| label           | 标签文本，默认自动添加冒号                                                                                      | string  | -                            | -        |
| labelWidth      | label 宽度，可用任意 CSS 长度单位，优先级高于 Form 设置的 labelWidth                                            | string  |                              |
| required        | 是否必填                                                                                                        | boolean | true \| false                | false    |
| showColon       | 是否显示冒号                                                                                                    | boolean | true \| false                | -        |
| rules           | 表单验证规则，会覆盖 Form 设置的 rules，用法参考 [async-validator](https://github.com/yiminghe/async-validator) | object  | -                            | -        |
| valuePropName   | 子节点的值的属性，如 Switch Radio Checkbox 的是 'checked'                                                       | string  | -                            | 'value'  |
| contentPosition | 指定显示内容的位置的位置，对一些非 HiUI 表单组件进行设置                                                        | string  | 'top' \| 'center' \|'bottom' | 'center' |

## SchemaItem

> 继承 Form.Item API

| 参数           | 说明                                                                                                                                                         | 类型                | 可选值 | 默认值 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- | ------ | ------ |
| component      | 用于渲染的组件名称(现在组件名称，只限于 HiUI 中的组件名）；如果传入 **ReactNode** 的情况下，**componentProps** 属性失效，同时也会默认控制组件 **value** 属性 | string \| ReactNode | -      | -      |
| componentProps | 组件的属性                                                                                                                                                   | string              | -      | -      |

## Form.Submit

> 继承 Button API

| 参数    | 说明                                                           | 类型     | 可选值 | 默认值    |
| ------- | -------------------------------------------------------------- | -------- | ------ | --------- |
| onClick | 点击提交后触发 Function(value: Object, errors: Object) => void | Function | -      | func.noop |
| fields  | 需要校验的 field 字段，不传入的话就是默认全部校验              | Array    | -      | -         |

## Form.Reset

> 继承 Button API

| 参数      | 说明                                              | 类型     | 默认值    |
| --------- | ------------------------------------------------- | -------- | --------- |
| onClick   | 点击提交后触发 () => void                         | Function | func.noop |
| fields    | 需要重置的 field 字段，不传入的话就是默认全部重置 | Array    | -         |
| toDefault | 返回默认值                                        | Boolean  | true      |

## Methods

| 方法名                                                                         | 说明                                                                                            |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| validate(callback: (fields: Object, errors: Object) => void, fields:Array)     | 对整个表单进行校验, 对应 [Form.Submit](#Form.Submit)中的 API                                    |
| validateField(fields: []string, callback: errors => void)                      | 对指定表单字段进行校验                                                                          |
| resetValidates(callback:() => void, fields:Array, toDefault:boolean)           | 重置整个表单的验证,对应 [Form.Reset](#Form.Reset)中的 API                                       |
| setFieldsValue(field: Object)                                                  | 设置表单的值，在异步获取的数据回显的时候，使用该方法                                            |
| setListItemFieldsValue(ListItemInfo: Object)                                   | 设置表单中 From.List 的指定项的值 [ListItemInfo](#ListItemInfo)                                 |
| getFieldsValue( fields: Object ) => Object                                     | 获取一组字段名对应的 Values 返回为数组形式, 不传入 fields；默认返回全部信息, 不会触发表单校验   |
| getFieldsError( fields: []string ) => Object                                   | 获取一组字段名对应的错误信息，返回为数组形式, 不传入 fields；默认返回全部信息                   |
| clearValidates( fields: []string ) => void                                     | 移除表单项的校验结果。传入待移除的表单项的 field 属性组成的数组，如不传则移除整个表单的校验结果 |
| updateFormSchema( schemaData: {fileName: [SchemaItem](#SchemaItem) } ) => void | 当 **SchemaItem** 中对应的 **schema** 数据更新时，请调用该方法更新                              |

## ListItemInfo

| 参数     | 说明                                             | 类型   | 可选值 | 默认值 |
| -------- | ------------------------------------------------ | ------ | ------ | ------ |
| name     | 对应 `Form.Item` 中的 name，在列表项中的属性名称 | string | -      | -      |
| listname | 需要更新的列表名称                               | string | -      | -      |
| row      | 对应 `Form.Item` 中的 row，表示列表的第几行      | string | -      | -      |
| value    | 需要更新的值                                     | any    | -      | -      |

## Rules

> [更多规则](https://github.com/yiminghe/async-validator)

| 名称       | 说明                                                                                                                        | 类型                          |
| ---------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| enum       | 是否匹配枚举中的值                                                                                                          | any[]                         |
| len        | string 类型时为字符串长度；number 类型时为确定数字； array 类型时为数组长度                                                 | number                        |
| max        | 必须设置 `type`：string 类型为字符串最大长度；number 类型时为最大值；array 类型时为数组最大长度                             | number                        |
| message    | 错误信息                                                                                                                    | string                        |
| min        | 必须设置 `type`：string 类型为字符串最小长度；number 类型时为最小值；array 类型时为数组最小长度                             | number                        |
| pattern    | 正则表达式匹配                                                                                                              | RegExp                        |
| required   | 是否为必选字段                                                                                                              | boolean                       |
| transform  | 将字段值转换成目标值后进行校验                                                                                              | (value) => any                |
| type       | 类型，常见有 `string` \|`number` \|`boolean` \| `email`。更多请参考[此处](https://github.com/yiminghe/async-validator#type) | string                        |
| validator  | 自定义校验                                                                                                                  | (rule,value,callback) => void |
| whitespace | 如果字段仅包含空格则校验不通过                                                                                              | boolean                       |

## CHANGELOG

### Form

| 参数                 | 变更类型                        | 变更内容        | 解决的问题                                                        |
| -------------------- | ------------------------------- | --------------- | ----------------------------------------------------------------- |
| propName             | feature \| deprecated \| update | 变更了什么      | 之前是什么样子，解决什么问题                                      |
| ----                 | ----                            | ----            | ----                                                              |
| innerRef             | update                          | ref -> innerRef | 解决名字占用，ref 功能作为 dom 引用获取，回调方法写法支持 Promise |
| initialErrors        | feature                         | -               | 强化功能                                                          |
| initialTouched       | feature                         | -               | 强化功能                                                          |
| validateTrigger      | feature                         | -               | 强化功能                                                          |
| validateAfterTouched | feature                         | -               | 强化功能                                                          |
| lazyValidate         | feature                         | -               | 强化功能                                                          |
| onSubmit             | feature                         | -               | 强化功能                                                          |
| onReset              | feature                         | -               | 强化功能                                                          |

### FormItem

| 参数                    | 变更类型                        | 变更内容                   | 解决的问题                   |
| ----------------------- | ------------------------------- | -------------------------- | ---------------------------- |
| propName                | feature \| deprecated \| update | 变更了什么                 | 之前是什么样子，解决什么问题 |
| ----                    | ----                            | ----                       | ----                         |
| required                | update                          | 定义：只做展示，不做校验   | 优化功能                     |
| valueType               | feature                         | -                          | 强化功能                     |
| valueChangeFuncPropName | feature                         | -                          | 强化功能                     |
| valueDispatchTransform  | feature                         | -                          | 强化功能                     |
| valueConnectTransform   | feature                         | -                          | 强化功能                     |
| validateTrigger         | feature                         | -                          | 强化功能                     |
| children                | feature                         | 支持函数自定义渲染表单控件 | 强化功能                     |

### FormList

| 参数     | 变更类型                        | 变更内容                                                                                                                                                       | 解决的问题                   |
| -------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| propName | feature \| deprecated \| update | 变更了什么                                                                                                                                                     | 之前是什么样子，解决什么问题 |
| ----     | ----                            | ----                                                                                                                                                           | ----                         |
| children | feature                         | (fields: Field[], operation: { add, remove }) => React.ReactNode -> (fields: Field[], operation: { add, remove, swap, insertBefore, move }) => React.ReactNode | 强化支持                     |

### SchemeForm

> SchemaItem 内部废弃，作为物料高级组件进行扩展
