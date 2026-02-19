import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  EditButton,
  DeleteButton,
  useRecordContext,
  useListContext,
} from "react-admin";

const RowNumberField = () => {
  const record = useRecordContext();
  const { data } = useListContext();
  if (!record || !data) return null;
  const index = data.findIndex(r => r.id === record.id);
  return <span>{index + 1}</span>;
};
RowNumberField.defaultProps = { label: "#" };

export const ToolList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RowNumberField />
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
