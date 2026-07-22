import { jsx as e } from "react/jsx-runtime";
import { cx as a } from "@hi-ui/classname";
import { Drawer as s } from "@hi-ui/hiui";
import i from "./index.module.scss.js";
function n({
  className: o,
  bodyClassName: r,
  children: t,
  ...m
}) {
  return /* @__PURE__ */ e(s, { className: a(i.drawerRoot, o), ...m, children: r ? /* @__PURE__ */ e("div", { className: r, children: t }) : t });
}
function p({
  className: o,
  children: r
}) {
  return /* @__PURE__ */ e("div", { className: a(i.drawerBody, o), children: r });
}
export {
  n as ProDetailDrawer,
  p as ProDetailDrawerBody,
  i as proDetailDrawerStyles
};
