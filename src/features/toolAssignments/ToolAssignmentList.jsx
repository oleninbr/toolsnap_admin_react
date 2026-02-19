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

export const ToolAssignmentList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <ReferenceField source="tool_id" reference="tools" label="Tool">
        <TextField source="serial_number" />
      </ReferenceField>
      <ReferenceField source="user_id" reference="users">
        <TextField source="full_name" />
      </ReferenceField>
      <ReferenceField source="taken_location_id" reference="locations" label="Taken Location">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="returned_location_id" reference="locations" label="Returned Location">
        <TextField source="title" />
      </ReferenceField>
      <DateField source="taken_at" showTime />
      <DateField source="returned_at" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
