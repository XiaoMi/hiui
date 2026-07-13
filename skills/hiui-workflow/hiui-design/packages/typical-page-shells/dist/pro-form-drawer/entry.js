import { jsx as t } from "react/jsx-runtime";
import { cx as m } from "@hi-ui/classname";
import { Drawer as i } from "@hi-ui/hiui";
import a from "./index.module.scss.js";
function w({
  className: o,
  bodyClassName: r,
  children: e,
  ...s
}) {
  return /* @__PURE__ */ t(i, { className: m(a.drawerRoot, o), ...s, children: r ? /* @__PURE__ */ t("div", { className: r, children: e }) : e });
}
function l({
  className: o,
  children: r
}) {
  return /* @__PURE__ */ t("div", { className: m(a.drawerFooterActions, o), children: r });
}
export {
  l as ProDrawerFooterActions,
  w as ProFormDrawer,
  a as proFormDrawerStyles
};
