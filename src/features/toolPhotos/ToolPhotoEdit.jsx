import {
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  required,
} from "react-admin";

export const ToolPhotoEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="original_name" validate={[required()]} fullWidth />
      
      <ReferenceInput source="tool_id" reference="tools">
        <SelectInput optionText="serial_number" validate={[required()]} />
      </ReferenceInput>
      
      <DateTimeInput source="upload_date" />
      
      <ReferenceInput source="photo_type_id" reference="photo-types">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
