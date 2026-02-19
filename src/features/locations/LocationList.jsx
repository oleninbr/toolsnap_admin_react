import {
  List,
  Datagrid,
  TextField,
  NumberField,
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

export const LocationList = () => (
  <List>
    <Datagrid rowClick="edit">
      <RowNumberField />
      <TextField source="name" />
      <ReferenceField source="locationTypeId" reference="location-types">
        <TextField source="title" />
      </ReferenceField>
      <TextField source="address" />
      <NumberField source="latitude" />
      <NumberField source="longitude" />
      <BooleanField source="isActive" />
      <DateField source="createdAt" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
