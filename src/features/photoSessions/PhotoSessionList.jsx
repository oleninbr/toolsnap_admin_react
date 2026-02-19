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
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const PhotoSessionListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="photo-sessions" />
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

export const PhotoSessionList = () => (
  <List actions={<PhotoSessionListActions />}>
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
