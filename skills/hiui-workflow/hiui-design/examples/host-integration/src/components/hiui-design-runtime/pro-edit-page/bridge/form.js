import { jsx as o, jsxs as c } from "react/jsx-runtime";
import { useRef as h } from "react";
import { Loading as p } from "@hi-ui/hiui";
import { SchemaForm as d } from "@hi-ui/schema-form";
/* empty css                               */
/* empty css                                                              */
import { useProEditPageContext as f } from "../context/entry.js";
import { useInnerContext as s } from "../context/inner.js";
import { TypicalPageFieldMapProvider as a } from "../../schema-field-map/field-map.js";
function v(r) {
  const u = h(null), { formRef: i, loading: e } = f(), { propsRef: t } = s(), { fields: m, groups: n } = t.current;
  return /* @__PURE__ */ c("div", { ref: u, style: { position: "relative", minHeight: "100%" }, children: [
    /* @__PURE__ */ o(a, { children: /* @__PURE__ */ o(d, { ...r, fields: m, groups: n, formRef: i }) }),
    /* @__PURE__ */ o(p, { visible: e.detailLoading, part: !0, container: u.current })
  ] });
}
export {
  v as Form
};
