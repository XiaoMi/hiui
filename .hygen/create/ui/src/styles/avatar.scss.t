---
to: <%= h.uiDir(`${name}/src/styles/${name}.scss`) %>
---
@import '~@hi-ui/core-css/lib/index.scss';

$prefixCls: #{$componentPrefix}-<%= name %> !default;

.#{$prefixCls} {

}
