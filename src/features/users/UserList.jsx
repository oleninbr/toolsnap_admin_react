import {
  List,
  Datagrid,
  TextField,
  BooleanField,
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

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <TextField source="full_name" />
      <TextField source="email" />
      <BooleanField source="confirmed_email" />
      <ReferenceField source="role_id" reference="roles">
        <TextField source="title" />
      </ReferenceField>
      <BooleanField source="is_active" />
      <DateField source="created_at" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
