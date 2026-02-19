import {
  List,
  Datagrid,
  TextField,
  NumberField,
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

export const PhotoSessionList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <NumberField source="latitude" />
      <NumberField source="longitude" />
      <ReferenceField source="action_type_id" reference="action-types">
        <TextField source="title" />
      </ReferenceField>
      <DateField source="created_at" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
