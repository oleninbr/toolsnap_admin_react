import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  useRecordContext,
  useListContext,
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const RoleListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="roles" />
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

export const RoleList = () => (
  <List actions={<RoleListActions />}>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <TextField source="title" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
