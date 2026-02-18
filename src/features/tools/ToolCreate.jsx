import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";

export const ToolCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="serial_number" />

      <ReferenceInput source="brand_id" reference="brands">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="model_id" reference="models">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="tool_type_id" reference="tool_types">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="tool_status_id" reference="tool_statuses">
        <SelectInput optionText="title" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
