import { jsx as e } from "react/jsx-runtime";
import { Button as c } from "@hi-ui/hiui";
import { useInnerContext as p } from "../context/inner.js";
function m(t) {
  const { propsRef: n } = p(), { children: o = "取消", ...r } = t;
  return /* @__PURE__ */ e(c, { type: "default", onClick: () => n.current.onCancel?.(), ...r, children: o });
}
export {
  m as CancelButton
};
