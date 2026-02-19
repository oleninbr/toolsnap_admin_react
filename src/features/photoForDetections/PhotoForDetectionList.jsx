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
  TopToolbar,
  CreateButton,
} from "react-admin";
import { ExportButton } from "../../components/ExportButton";

const PhotoForDetectionListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="photos-for-detection" />
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

export const PhotoForDetectionList = () => (
  <List actions={<PhotoForDetectionListActions />}>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <ReferenceField source="photo_session_id" reference="photo-sessions" label="Photo Session">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="original_name" />
      <DateField source="upload_date" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
