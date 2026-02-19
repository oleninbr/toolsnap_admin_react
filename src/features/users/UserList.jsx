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
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const UserListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="users" />
  </TopToolbar>
);

const RowNumberField = () => {
  const record = useRecordContext();
  const { data } = useListContext();
  if (!record || !data) return null;
  const index = data.findIndex(r => r.id === record.id);
  return <span>{index + 1}</span>;
};
RowNumberField.defaultProps = { label: "#" };

export const UserList = () => (
  <List actions={<UserListActions />}>
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
