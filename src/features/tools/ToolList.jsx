import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  EditButton,
  DeleteButton,
} from "react-admin";

export const ToolList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="serial_number" />

      <ReferenceField source="brand_id" reference="brands">
        <TextField source="title" />
      </ReferenceField>

      <ReferenceField source="model_id" reference="models">
        <TextField source="title" />
      </ReferenceField>

      <ReferenceField source="tool_type_id" reference="tool_types">
        <TextField source="title" />
      </ReferenceField>

      <ReferenceField source="tool_status_id" reference="tool_statuses">
        <TextField source="title" />
      </ReferenceField>

      <DateField source="created_at" />

      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
