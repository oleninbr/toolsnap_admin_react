import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateInput,
} from "react-admin";

export const ToolEdit = () => (
  <Edit>
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

      <DateInput source="created_at" />
    </SimpleForm>
  </Edit>
);
