import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  ReferenceField,
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

export const DetectedToolList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <ReferenceField source="photo_session_id" reference="photo-sessions" label="Photo Session">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="tool_type_id" reference="tool-types">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="brand_id" reference="brands">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="model_id" reference="models">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="serial_number" />
      <NumberField source="confidence" />
      <BooleanField source="red_flagged" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
