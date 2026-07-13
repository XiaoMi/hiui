import { SchemaFormProps } from '@hi-ui/schema-form';
import './schema-form-group-spacing.scss';
import '../../schema-field-map/schema-form-check-select-tag-layout.scss';
type FormBridgeProps = Omit<SchemaFormProps, 'formRef' | 'fields' | 'groups'>;
declare function FormBridge(props: FormBridgeProps): import("react/jsx-runtime").JSX.Element;
export { FormBridge as Form, type FormBridgeProps as FormProps, };
