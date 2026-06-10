import { jsx as o } from "react/jsx-runtime";
import { Loading as p } from "@hi-ui/hiui";
import { SchemaForm as d } from "@hi-ui/schema-form";
/* empty css                               */
/* empty css                                                              */
import { useProEditPageContext as f } from "../context/entry.js";
import { useInnerContext as s } from "../context/inner.js";
import { TypicalPageFieldMapProvider as a } from "../../schema-field-map/field-map.js";
function v(r) {
  const { formRef: i, loading: e } = f(), { propsRef: t } = s(), { fields: m, groups: n } = t.current;
  return /* @__PURE__ */ o(p, { visible: e.detailLoading, children: /* @__PURE__ */ o(a, { children: /* @__PURE__ */ o(d, { ...r, fields: m, groups: n, formRef: i }) }) });
}
export {
  v as Form
};
