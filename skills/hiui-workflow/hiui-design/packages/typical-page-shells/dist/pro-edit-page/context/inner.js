import { jsx as r } from "react/jsx-runtime";
import n from "react";
const t = n.createContext(null);
function u(e) {
  return /* @__PURE__ */ r(t.Provider, { value: e.value, children: e.children });
}
function c() {
  const e = n.useContext(t);
  if (!e)
    throw new Error("useInnerContext must be used within a ProEditPage");
  return e;
}
export {
  u as InnerProvider,
  c as useInnerContext
};
