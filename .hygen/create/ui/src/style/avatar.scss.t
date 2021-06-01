---
to: <%= h.uiDir(`${name}/src/style/${name}.scss`) %>
---
@import '~@hi-ui/core-css/lib/index.scss';

$prefixCls: #{$componentPrefix}-<%= name %> !default;

.#{$prefixCls} {

}
