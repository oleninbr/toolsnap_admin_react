import {
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  required,
} from "react-admin";

export const PhotoForDetectionCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="photo_session_id" reference="photo-sessions">
        <SelectInput optionText="id" validate={[required()]} />
      </ReferenceInput>
      
      <TextInput source="original_name" validate={[required()]} fullWidth />
      <DateTimeInput source="upload_date" />
    </SimpleForm>
  </Create>
);
