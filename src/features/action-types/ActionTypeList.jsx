import {
  List,
  Datagrid,
  TextField,
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

export const ActionTypeList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <TextField source="title" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
