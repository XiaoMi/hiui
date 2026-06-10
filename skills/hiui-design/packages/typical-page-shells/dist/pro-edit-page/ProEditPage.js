import { jsx as e } from "react/jsx-runtime";
import { useProps as i } from "./hooks/use-props.js";
import t from "./index.module.scss.js";
import { InnerProvider as n } from "./context/inner.js";
function d(r) {
  const { propsRef: o } = i(r);
  return /* @__PURE__ */ e(n, { value: { propsRef: o }, children: /* @__PURE__ */ e("div", { className: `pro-edit-page ${t.pageContainer}`, children: r.children }) });
}
export {
  d as ProEditPage
};
