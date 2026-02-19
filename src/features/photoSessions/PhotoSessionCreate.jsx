import {
  Create,
  SimpleForm,
  NumberInput,
  ReferenceInput,
  SelectInput,
  DateTimeInput,
  required,
} from "react-admin";

export const PhotoSessionCreate = () => (
  <Create>
    <SimpleForm>
      <NumberInput source="latitude" validate={[required()]} />
      <NumberInput source="longitude" validate={[required()]} />
      
      <ReferenceInput source="action_type_id" reference="action-types">
        <SelectInput optionText="title" validate={[required()]} />
      </ReferenceInput>
      
      <DateTimeInput source="created_at" />
    </SimpleForm>
  </Create>
);
