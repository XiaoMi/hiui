import { ProCheckSelect as o } from "@hi-ui/schema-fields/bundle";
class P extends o {
  getSelfFieldProps(t) {
    const e = super.getSelfFieldProps(t), r = e.fieldProps, s = r.tagInputProps ?? {};
    return {
      ...e,
      fieldProps: {
        ...r,
        tagInputProps: { wrap: !0, ...s }
      }
    };
  }
}
export {
  P as StableProCheckSelect
};
