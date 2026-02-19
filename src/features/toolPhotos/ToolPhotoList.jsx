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

const ToolPhotoListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton filename="tool-photos" />
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

export const ToolPhotoList = () => (
  <List actions={<ToolPhotoListActions />}>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <TextField source="original_name" />
      <ReferenceField source="tool_id" reference="tools" label="Tool">
        <TextField source="serial_number" />
      </ReferenceField>
      <DateField source="upload_date" showTime />
      <ReferenceField source="photo_type_id" reference="photo-types">
        <TextField source="title" />
      </ReferenceField>
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
